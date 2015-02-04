/**
 * Titanium
 *
 * Copyright (c) 2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#include "Titanium/Titanium.hpp"
#include "NativeGlobalObjectExample.hpp"
#import <XCTest/XCTest.h>

using namespace HAL;

@interface GlobalObjectTests : XCTestCase
@end

@implementation GlobalObjectTests {
  JSContextGroup js_context_group;
}

- (void)setUp {
  [super setUp];
  // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
  // Put teardown code here. This method is called after the invocation of each test method in the class.
  [super tearDown];
}

- (void)testBasicFeatures
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  auto foo = js_context.CreateObject();

  XCTAssertFalse(foo.HasProperty("bar"));
  auto bar = js_context.CreateObject();
  foo.SetProperty("bar", bar, {JSPropertyAttribute::ReadOnly, JSPropertyAttribute::DontDelete});
  XCTAssertTrue(foo.HasProperty("bar"));

  XCTAssertFalse(bar.HasProperty("baz"));
  auto baz = js_context.CreateObject();
  bar.SetProperty("baz", baz, {JSPropertyAttribute::ReadOnly, JSPropertyAttribute::DontDelete});
  XCTAssertTrue(bar.HasProperty("baz"));

  XCTAssertFalse(baz.HasProperty("number"));
  baz.SetProperty("number", js_context.CreateNumber(42), {JSPropertyAttribute::DontDelete});
  XCTAssertTrue(baz.HasProperty("number"));

  XCTAssertFalse(global_object.HasProperty("foo"));
  global_object.SetProperty("foo", foo, {JSPropertyAttribute::ReadOnly, JSPropertyAttribute::DontDelete});
  XCTAssertTrue(global_object.HasProperty("foo"));

  auto number = js_context.JSEvaluateScript("foo.bar.baz.number;");
  XCTAssertEqual(42, static_cast<uint32_t>(number));
  //std::clog << "MDL: number = " << number << std::endl;

  number = js_context.JSEvaluateScript("foo.bar.baz.number = 24;");
  XCTAssertEqual(24, static_cast<uint32_t>(number));

  for (const auto& property_name : static_cast<std::vector<JSString>>(global_object.GetPropertyNames())) {
    std::clog << "MDL: property_name = " << property_name << std::endl;
  }

  XCTAssertTrue(global_object.HasProperty("global"));
  XCTAssertTrue(global_object.HasProperty("require"));
  XCTAssertTrue(global_object.HasProperty("setTimeout"));
  XCTAssertTrue(global_object.HasProperty("setInterval"));
  XCTAssertTrue(global_object.HasProperty("clearInterval"));
  XCTAssertTrue(global_object.HasProperty("clearTimeout"));
}

- (void)testRequireFunctionModuleExports
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var hello = require('hello');
      hello('World');
    )js";

  std::string hello_js = R"js(
      module.exports = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("/node_modules/hello.js", hello_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}

- (void)testRequireFunctionExports
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var m = require('hello');
      m.hello('World');
    )js";

  std::string hello_js = R"js(
      exports.hello = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("/node_modules/hello.js", hello_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}

- (void)testRequireMultipleFunctions
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var hello1 = require('hello');
      var hello2 = require('hello');
      hello1('World1 ') + hello2('World2');
    )js";

  std::string hello_js = R"js(
      module.exports = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("/node_modules/hello.js", hello_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World1 Hello, World2", static_cast<std::string>(result));
}

- (void)testRequireNestedModuleExports
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var hello = require('m');
      hello('World');
    )js";

  std::string module_js = R"js(
      var hello = require('hello');
      module.exports = hello;
    )js";

  std::string hello_js = R"js(
      module.exports = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("/node_modules/hello.js", hello_js);
  global_object_ptr->add_require("/node_modules/m.js", module_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}

- (void)testRequireNestedExports
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var m = require('m');
      m.hello('World');
    )js";

  std::string module_js = R"js(
      var hello = require('hello');
      exports.hello = hello.hello;
    )js";

  std::string hello_js = R"js(
      exports.hello = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("/node_modules/hello.js", hello_js);
  global_object_ptr->add_require("/node_modules/m.js", module_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}

- (void)testRequireNestedFromCurrent
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();

  std::string app_js = R"js(
      var m = require('./m');
      m.hello('World');
    )js";

  std::string module_js = R"js(
      var hello = require('./hello');
      exports.hello = hello.hello;
    )js";

  std::string hello_js = R"js(
      exports.hello = sayHello;
      function sayHello(name) {
        return 'Hello, ' + name;
      }
    )js";

  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);

  global_object_ptr->add_require("hello.js", hello_js);
  global_object_ptr->add_require("m.js", module_js);
  JSValue result = js_context.JSEvaluateScript(app_js);

  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}

- (void)testRequireNestedFromDirectory
{
  JSContext js_context = js_context_group.CreateContext(JSExport<NativeGlobalObjectExample>::Class());
  auto global_object = js_context.get_global_object();
  
  std::string app_js = R"js(
  var m = require('m');
  m.hello('World');
  )js";
  
  std::string module_js = R"js(
  var hello = require('hello');
  exports.hello = hello.hello;
  )js";
  
  std::string hello_js = R"js(
  exports.hello = sayHello;
  function sayHello(name) {
    return 'Hello, ' + name;
  }
  )js";
  
  auto global_object_ptr = global_object.GetPrivate<NativeGlobalObjectExample>();
  XCTAssertNotEqual(nullptr, global_object_ptr);
  
  global_object_ptr->add_require("/node_modules/hello/index.js", hello_js);
  global_object_ptr->add_require("/node_modules/m.js", module_js);
  JSValue result = js_context.JSEvaluateScript(app_js);
  
  XCTAssertTrue(result.IsString());
  XCTAssertEqual("Hello, World", static_cast<std::string>(result));
}
@end
