/**
 * TitaniumKit
 *
 * Copyright (c) 2014-2015 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#ifndef _TITANIUM_UI_LABEL_HPP_
#define _TITANIUM_UI_LABEL_HPP_

#include "Titanium/UI/Constants.hpp"
#include "Titanium/UI/View.hpp"
#include "Titanium/UI/Font.hpp"

namespace Titanium
{
	namespace UI
	{
		using namespace HAL;

		/*!
		  @class

		  @discussion This is the Titanium UI Label.

		  See http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Label
		*/
		class TITANIUMKIT_EXPORT Label : public View, public JSExport<Label>
		{
		public:
			/*!
			  @method

			  @abstract color : String

			  @discussion Color of the label text, as a color name or hex triplet.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(std::string, color);

			/*!
			  @method

			  @abstract ellipsize : Boolean

			  @discussion Turn on/off the addition of ellipses at the end of the label if the text is too large to fit.

			  Default: false
			*/
			TITANIUM_PROPERTY_IMPL_DEF(bool, ellipsize);

			/*!
			  @method

			  @abstract font : Font

			  @discussion Font to use for the label text.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(Font, font);

			/*!
			  @method

			  @abstract text : String

			  @discussion Label text.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(std::string, text);

			/*!
			  @method

			  @abstract textAlign : String/Number

			  @discussion Text alignment.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(TEXT_ALIGNMENT, textAlign);

			/*!
			  @method

			  @abstract verticalAlign : String/Number

			  @discussion Vertical text alignment, specified using one of the vertical alignment constants from Titanium.UI.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(TEXT_VERTICAL_ALIGNMENT, verticalAlign);

			/*!
			  @method

			  @abstract wordWrap : Boolean

			  @discussion Enable or disable word wrapping in the label.
			*/
			TITANIUM_PROPERTY_IMPL_DEF(bool, wordWrap);

			Label(const JSContext&) TITANIUM_NOEXCEPT;

			virtual ~Label() = default;
			Label(const Label&) = default;
			Label& operator=(const Label&) = default;
#ifdef TITANIUM_MOVE_CTOR_AND_ASSIGN_DEFAULT_ENABLE
			Label(Label&&) = default;
			Label& operator=(Label&&) = default;
#endif

			static void JSExportInitialize();

			TITANIUM_PROPERTY_DEF(color);
			TITANIUM_FUNCTION_DEF(getColor);
			TITANIUM_FUNCTION_DEF(setColor);

			TITANIUM_PROPERTY_DEF(ellipsize);
			TITANIUM_FUNCTION_DEF(getEllipsize);
			TITANIUM_FUNCTION_DEF(setEllipsize);

			TITANIUM_PROPERTY_DEF(font);
			TITANIUM_FUNCTION_DEF(getFont);
			TITANIUM_FUNCTION_DEF(setFont);

			TITANIUM_PROPERTY_DEF(text);
			TITANIUM_FUNCTION_DEF(getText);
			TITANIUM_FUNCTION_DEF(setText);

			TITANIUM_PROPERTY_DEF(textAlign);
			TITANIUM_FUNCTION_DEF(getTextAlign);
			TITANIUM_FUNCTION_DEF(setTextAlign);

			TITANIUM_PROPERTY_DEF(verticalAlign);
			TITANIUM_FUNCTION_DEF(getVerticalAlign);
			TITANIUM_FUNCTION_DEF(setVerticalAlign);

			TITANIUM_PROPERTY_DEF(wordWrap);
			TITANIUM_FUNCTION_DEF(getWordWrap);
			TITANIUM_FUNCTION_DEF(setWordWrap);

		private:
#pragma warning(push)
#pragma warning(disable : 4251)
			std::string color__;
			bool ellipsize__;
			Font font__;
			std::string text__;
			TEXT_ALIGNMENT textAlign__;
			TEXT_VERTICAL_ALIGNMENT verticalAlign__;
			bool wordWrap__;
#pragma warning(pop)
		};
	} // namespace UI
}  // namespace Titanium

#endif  // _TITANIUM_UI_LABEL_HPP_
