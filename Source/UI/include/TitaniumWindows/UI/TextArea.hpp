/**
 * Titanium.UI.TextArea for Windows
 *
 * Copyright (c) 2015 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#ifndef _TITANIUMWINDOWS_TEXTAREA_HPP_
#define _TITANIUMWINDOWS_TEXTAREA_HPP_

#include "TitaniumWindows/UI/detail/UIBase.hpp"

namespace TitaniumWindows
{
	namespace UI
	{
		using namespace HAL;

		/*!
		  @class

		  @discussion This is the Titanium.UI.TextArea implementation for Windows.
		*/
		class TITANIUMWINDOWS_UI_EXPORT TextArea final : public Titanium::UI::TextArea, public JSExport<TextArea>
		{

		public:
			
			TextArea(const JSContext&) TITANIUM_NOEXCEPT;
			virtual ~TextArea()                  = default;
			TextArea(const TextArea&)            = default;
			TextArea& operator=(const TextArea&) = default;
#ifdef TITANIUM_MOVE_CTOR_AND_ASSIGN_DEFAULT_ENABLE
			TextArea(TextArea&&)                 = default;
			TextArea& operator=(TextArea&&)      = default;
#endif

			static void JSExportInitialize();
			virtual void postCallAsConstructor(const JSContext& js_context, const std::vector<JSValue>& arguments) override;

			virtual void set_autocorrect(const bool&) TITANIUM_NOEXCEPT override final;
			virtual void set_color(const std::string&) TITANIUM_NOEXCEPT override final;
			virtual void set_editable(const bool&) TITANIUM_NOEXCEPT override final;
			virtual void set_font(const Titanium::UI::Font& font) TITANIUM_NOEXCEPT override final;
			virtual void set_keyboardType(const Titanium::UI::KEYBOARD& keyboardType) TITANIUM_NOEXCEPT override final;
			virtual void set_hintText(const std::string&) TITANIUM_NOEXCEPT override final;
			virtual JSValue get_selection() const TITANIUM_NOEXCEPT override final;
			virtual void set_maxLength(const int32_t&) TITANIUM_NOEXCEPT override final;
			virtual void set_textAlign(const Titanium::UI::TEXT_ALIGNMENT& textAlign) TITANIUM_NOEXCEPT override final;
			virtual std::string get_value() const TITANIUM_NOEXCEPT override final;
			virtual void set_value(const std::string&) TITANIUM_NOEXCEPT override final;
			virtual void set_verticalAlign(const Titanium::UI::TEXT_VERTICAL_ALIGNMENT& verticalAlign) TITANIUM_NOEXCEPT override final;

			virtual void blur() TITANIUM_NOEXCEPT override final;
			virtual void focus() TITANIUM_NOEXCEPT override final;

		private:
#pragma warning(push)
#pragma warning(disable : 4251)
			std::unordered_map<std::string, std::string> custom_fonts__;
#pragma warning(pop)
			Windows::UI::Xaml::Controls::TextBox^ text_box__;

			// Event handlers
			Windows::Foundation::EventRegistrationToken blur_event_;
			Windows::Foundation::EventRegistrationToken change_event_;
			Windows::Foundation::EventRegistrationToken focus_event_;
			Windows::Foundation::EventRegistrationToken return_event_;

		};
	}  // namespace UI
}  // namespace TitaniumWindows
#endif // _TITANIUMWINDOWS_TEXTAREA_HPP_