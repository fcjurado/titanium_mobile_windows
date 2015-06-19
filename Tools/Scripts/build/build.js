/**
 * Copyright (c) 2015 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */
var path = require('path'),
	fs = require('fs'),
	async = require('async'),
	colors = require('colors'),
	wrench = require('wrench'),
	spawn = require('child_process').spawn,
	cmakeLocation = path.join(__dirname, '..', '..', '..', 'cli', 'vendor', 'cmake', 'bin', 'cmake.exe'),
	MSBuildLocation = 'C:/Program Files (x86)/MSBuild/12.0/Bin/MSBuild.exe';

// Now do the builds
var rootDir = path.join(__dirname, '..', '..', '..'),
	titaniumWindowsSrc = path.join(rootDir, 'Source', 'Titanium'),
	buildRoot = path.join(rootDir, 'build'),
	distRoot = path.join(rootDir, 'dist', 'windows'),
	distLib = path.join(distRoot, 'lib'),
	beQuiet = process.argv.indexOf('--quiet') >= 0,
	beParallel = process.argv.indexOf('--parallel') >= 0,
	overallTimer = process.hrtime(),
	timer = process.hrtime();

async.series([
	function buildAndPackageAll(next) {
		// TODO Maybe we can be more efficient by running the mocha tests here after we have enough of the libs to run the emulator.		
		// If they pass, keep building, otherwise exit early?
		(beParallel ? async.each : async.eachSeries)([
			{target: 'WindowsPhone', architecture: 'x86'},
			{target: 'WindowsPhone', architecture: 'ARM'},
			{target: 'WindowsStore', architecture: 'x86'}
		], function (configuration, next) {
			buildAndPackage(titaniumWindowsSrc, buildRoot, distLib, 'Release', configuration.target, configuration.architecture, next);
		}, next);
	},
	function measureTimeElapsed(next) {
		var elapsed = process.hrtime(timer);
		console.info('Build and Package Time: %ds %dms', elapsed[0], elapsed[1] / 1000000);
		timer = process.hrtime();
		next();
	},
	function copyIncludedHeaders(next) {
		console.log('Copying over include headers...');
		var newDir = path.join(distLib, 'TitaniumKit', 'include', 'Titanium');
		wrench.mkdirSyncRecursive(newDir);

		var tasks = [
			copyDir(path.join(rootDir, 'Source', 'HAL', 'include', 'HAL'), path.join(distLib, 'HAL', 'include', 'HAL')),
			copyDir(path.join(rootDir, 'Source', 'TitaniumKit', 'include', 'Titanium'), path.join(distLib, 'TitaniumKit', 'include', 'Titanium')),
			copyDir(path.join(process.env.JavaScriptCore_HOME, 'includes', 'JavaScriptCore'), path.join(distLib, 'HAL', 'include', 'JavaScriptCore')),

			copyDir(path.join(rootDir, 'Source', 'Utility', 'include', 'TitaniumWindows'), path.join(distLib, 'TitaniumWindows_Utility', 'include', 'TitaniumWindows')),
			copyDir(path.join(rootDir, 'Source', 'LayoutEngine', 'include', 'LayoutEngine'), path.join(distLib, 'LayoutEngine', 'include', 'LayoutEngine')),
			copyDir(path.join(rootDir, 'Source', 'Titanium', 'include', 'TitaniumWindows'), path.join(distLib, 'TitaniumWindows', 'include', 'TitaniumWindows')),

			copyFile(path.join(rootDir, 'package.json'), path.join(distRoot, 'package.json')),
			copyDir(path.join(rootDir, 'templates'), path.join(distRoot, 'templates')),
			// FIXME For some reason, locally this isn't copying all of cli/vendor/cmake/share (specifically cmake-3.1 subfolder)
			copyDir(path.join(rootDir, 'cli'), path.join(distRoot, 'cli'))
		];

		var include_TitaniumWindows = ['Filesystem', 'Global', 'Map', 'Media', 'Network', 'Sensors', 'Ti', 'UI'];
		for (var i = 0; i < include_TitaniumWindows.length; i++) {
			tasks.push(copyDir(path.join(rootDir, 'Source', include_TitaniumWindows[i], 'include', 'TitaniumWindows'), path.join(distLib, 'TitaniumWindows_' + include_TitaniumWindows[i], 'include', 'TitaniumWindows')));
		}

		async.parallel(tasks, next);
	},
	function measureTimeElapsed(next) {
		var elapsed = process.hrtime(timer);
		console.info('Header Copy Time: %ds %dms', elapsed[0], elapsed[1] / 1000000);
		elapsed = process.hrtime(overallTimer);
		console.info('Total Time: %ds %dms', elapsed[0], elapsed[1] / 1000000);
		next();
	}
	// TODO Generate docs and copy them over! We should start integrating together all these disparate node scripts into a cohesive set!
], function (err, results) {
	if (err) {
		console.error(err.toString().red);
		process.exit(1);
	} else {
		process.exit(0);
	}
});

/**
 * @param sourceDir The original source directory (in Source/)
 * @param buildDir Where to build the modules temporarily
 * @param destDir The top-level destination directory where we copy the built libraries
 * @param buildType 'Release' || 'Debug'
 * @param platform 'WindowsPhone' || 'WindowsStore'
 * @param arch 'x86' || 'ARM'
 * @param callback what to invoke when done/errored
 */
function buildAndPackage(sourceDir, buildDir, destDir, buildType, platform, arch, callback) {
	var platformAbbrev = (platform == 'WindowsPhone') ? 'phone' : 'store';
	console.log('Building ' + platform + ' 8.1 ' + arch + ': ' + buildType);
	async.series([
		function (next) {
			runCMake(sourceDir, path.join(buildDir, platformAbbrev, arch), buildType, platform, arch, next);
		},
		function (next) {
			runMSBuild(path.join(buildDir, platformAbbrev, arch, 'TitaniumWindows.sln'), buildType, arch, next);
		},
		function (next) {
			copyToDistribution(buildDir, destDir, buildType, platform, arch, next);
		}
	], function (err, results) {
		if (err) {
			callback(err);
		} else {
			// Wipe the build dir if everything went well. Don't remove top-level build root, because previous build steps may have added results we care about there (i.e. CTest)
			//wrench.rmdirSyncRecursive(path.join(buildDir, platformAbbrev, arch));
			callback();
		}
	});
}

/**
 * @param sourceDir Where the source is
 * @param buildDir Where to build the project
 * @param buildType 'Release' || 'Debug'
 * @param platform 'WindowsPhone' || 'WindowsStore'
 * @param arch 'x86' || 'ARM'
 * @param callback what to invoke when done/errored
 */
function runCMake(sourceDir, buildDir, buildType, platform, arch, callback) {
	var generator = 'Visual Studio 12 2013';

	// If the buildDir already exists, wipe it
	if (fs.existsSync(buildDir)) {
		wrench.rmdirSyncRecursive(buildDir);
	}
	wrench.mkdirSyncRecursive(buildDir);

	if ('ARM' == arch) {
		generator += ' ARM';
	}

	var args = [
		'-G', generator,
		'-DCMAKE_SYSTEM_NAME=' + platform,
		'-DCMAKE_BUILD_TYPE=' + buildType,
		'-DCMAKE_SYSTEM_VERSION=8.1',
		'-DTitaniumWindows_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Ti_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Global_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Sensors_DISABLE_TESTS=ON',
		'-DTitaniumWindows_UI_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Utility_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Map_DISABLE_TESTS=ON',
		'-DTitaniumWindows_Media_DISABLE_TESTS=ON',
		'-DHAL_DISABLE_TESTS=ON',
		'-DTitaniumKit_DISABLE_TESTS=ON',
		'-Wno-dev',
		sourceDir
	];

	var options = {cwd: buildDir};
	spawnWithArgs('CMake', cmakeLocation, args, options, callback);
}

/**
 * @param slnFile The VS solution file to build.
 * @param buildType 'Release' || 'Debug'
 * @param arch 'x86' || 'ARM'
 * @param callback what to invoke when done/errored
 */
function runMSBuild(slnFile, buildType, arch, callback) {
	var args = ['/p:Configuration=' + buildType];
	if ('ARM' == arch) {
		args.unshift('/p:Platform=ARM');
	}
	args.unshift(slnFile);
	beParallel && args.push('/m');
	spawnWithArgs('MSBuild', MSBuildLocation, args, {}, callback);
}

/**
 * @param sourceDir The top-level folder containing all the built libraries from the sln
 * @param destDir The top-level destination directory where we copy the built libraries
 * @param buildType 'Release' || 'Debug'
 * @param platform 'WindowsPhone' || 'WindowsStore'
 * @param arch 'x86' || 'ARM'
 * @param callback what to invoke when done/errored
 */
function copyToDistribution(sourceDir, destDir, buildType, platform, arch, callback) {
	var platformAbbrev = (platform == 'WindowsPhone') ? 'phone' : 'store',
		libs = {
			// Library full name : output location
			'TitaniumWindows_Sensors': 'Sensors',
			'TitaniumWindows_Filesystem': 'Filesystem',
			'TitaniumWindows_Global': 'Global',
			'HAL': 'Filesystem\\TitaniumKit\\HAL',
			'LayoutEngine': 'LayoutEngine',
			'TitaniumWindows_Map': 'Map',
			'TitaniumWindows_Media': 'Media',
			'TitaniumWindows_Network': 'Network',
			'TitaniumWindows_Ti': 'Ti',
			'TitaniumWindows': '',
			'TitaniumKit': 'Filesystem\\TitaniumKit',
			'TitaniumWindows_UI': 'Map\\UI',
			'TitaniumWindows_Utility': 'Filesystem\\Utility',
		},
		libDestDir,
		libSrcDir,
		suffix,
		lib,
		header;

	// For each lib, copy the output files!
	for (var key in libs) {
		if (!libs.hasOwnProperty(key)) {
			continue;
		}
		lib = key; // full name of the built lib files
		suffix = libs[key]; // relative path of built libs in build folder

		libSrcDir = path.join(sourceDir, platformAbbrev, arch, suffix, buildType);
		libDestDir = path.join(destDir, lib, platformAbbrev, arch);

		// Make the destination folder
		if (fs.existsSync(libDestDir)) {
			wrench.rmdirSyncRecursive(libDestDir);
		}
		wrench.mkdirSyncRecursive(libDestDir);

		// Copy the build artifacts
		// TODO Only copy dll/winmd/lib? Do we need anything else? pri?
		wrench.copyDirSyncRecursive(libSrcDir, libDestDir, {
			forceDelete: true, // Whether to overwrite existing directory or not
			preserveTimestamps: true, // Preserve the mtime and atime when copying files
			// FIXME This seems to be copying over everything for TitaniumWindows artifacts, but not sub-libraries
			include: new RegExp(lib + '\.*') // Include the library's artifacts regardless of file extension
		});
		// Copy the export header!
		header = lib.toLowerCase() + '_export.h';
		wrench.mkdirSyncRecursive(path.join(destDir, lib, 'include'));
		fs.writeFileSync(path.join(destDir, lib, 'include', header), fs.readFileSync(path.join(sourceDir, platformAbbrev, arch, suffix, header)));
	}
	callback();
}

/*
 Utility methods (not used elsewhere).
 */

/**
 * Spawns the specified file with its args, logging its output, and executing the callback when it has finished.
 * @param name
 * @param file
 * @param args
 * @param options
 * @param callback
 */
function spawnWithArgs(name, file, args, options, callback) {
	var child = spawn(file, args, options);
	child.stdout.on('data', function (data) {
		beQuiet || console.log(data.toString().trim());
	});
	child.stderr.on('data', function (data) {
		console.log(data.toString().trim().red);
	});
	child.on('close', function (code) {
		if (code != 0) {
			callback('Failed to run ' + name);
		} else {
			callback();
		}
	});
}

/**
 * Recursively copies a directory.
 * @param from
 * @param to
 */
function copyDir(from, to) {
	return function (next) {
		wrench.copyDirRecursive(from, to, {forceDelete: true}, function (err) {
			if (err) {
				next(err);
			}
			else {
				next();
			}
		});
	};
}

/**
 * Copies a file.
 * @param from
 * @param to
 */
function copyFile(from, to) {
	return function (next) {
		fs.createReadStream(from).pipe(fs.createWriteStream(to)).on('finish', function (err) {
			if (err) {
				next(err);
			}
			else {
				next();
			}
		});
	};
}
