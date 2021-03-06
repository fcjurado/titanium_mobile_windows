/**
 * TitaniumKit
 *
 * Copyright (c) 2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#include "NativeAPIExample.hpp"
#include <iostream>

NativeAPIExample::NativeAPIExample(const JSContext& js_context) TITANIUM_NOEXCEPT
    : Titanium::API(js_context)
{
	TITANIUM_LOG_DEBUG("NativeAPIExample:: ctor ", this);
}

NativeAPIExample::~NativeAPIExample() TITANIUM_NOEXCEPT
{
	TITANIUM_LOG_DEBUG("NativeAPIExample:: dtor ", this);
}

void NativeAPIExample::log(const std::string& message) const TITANIUM_NOEXCEPT
{
	TITANIUM_LOG_DEBUG("APIDelegateExample::log");
	std::clog << message << std::endl;
}

void NativeAPIExample::JSExportInitialize()
{
	JSExport<NativeAPIExample>::SetClassVersion(1);
	JSExport<NativeAPIExample>::SetParent(JSExport<Titanium::API>::Class());
}
