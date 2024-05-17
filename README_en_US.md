# SiYuan Notes - Knote Plugin

>Here is a detailed pictorial introduction: [https://ld246.com/article/1703831299597](https://ld246.com/article/1703831299597)

## Introduction
The K in KNote stands for Keep, so the purpose of KNote is to help you keep records continuously.

It assists you in practicing the daily note method in SiYuan, automatically displays the Callout content in the day's diary, and allows you to quickly add and jump through shortcuts.

The shortcut to call up the quick add input box is: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd> (Memory aid: Q stands for Quick, meaning quick add)

Welcome to discuss in QQ group: 130584094

## Usage
After installing the KNote plugin, a KNote icon will appear in the right dock bar. Click to call up the KNote panel, then click the settings button in the panel, set the specified notebook, and it will automatically refresh.

You can see the details here: [https://ld246.com/article/1703831299597](https://ld246.com/article/1703831299597)

## Limitations
1.~~Currently, it only supports the standard format of daily note, i.e., if you haven't changed the path of the daily note, then this plugin can be used normally, or if the path format of the diary is similar to the following: `/daily note/year-month-day`, then it should also work properly. Other path formats of daily note will be gradually adapted in the future~~
Thanks to f, due to f's new proposal, any path of daily note can now be used normally! (Experimental feature, please ensure SiYuan version 2.11.1+, and download and install the "Today's Note" plugin, it will guide you to fill in the missing diary properties)

2.~~It is recommended to use it with the [Savor Callout plugin](https://github.com/frostime/sy-bq-callout) for a complete experience,~~ (Added on February 21, 2024: Callout types are now built-in, ready to use out of the box~) Support for custom Callout types will be introduced later.

3.This is the first version, only tested on the win11 desktop end of SiYuan, ~~if there are too many Callouts on the day, there may be performance issues~~ (Performance has been optimized [v1.1.0+], feedback is welcome), suggestions are welcome
## Other
Why make this plugin?

A phrase I strongly agree with is: List the sources of information you receive each day. Find a method you think is most convenient to save the valuable content you read from these sources, and then think about where it should ultimately flow to.

The place it flows to is of course my favorite SiYuan Notes, but the most convenient method? Ok, it's time to develop the KNote for all platforms. The development progress of the standalone desktop version is currently 70%, supporting global addition, synchronization of SiYuan Callout, pinning to the desktop, and other features. If you are interested, you are welcome to discuss in the QQ group.

## Update Log

### v2.1.3 (May 17, 2024)

Fixes:

- Fixed a bug where the KNote quick input box would insert content into the previous day's diary when crossing days in the SiYuan.

Additions:

- Added a feature that automatically creates a diary for the current day when there is no diary for today and content is recorded using the KNote quick input box.

### v2.1.2 (March 20, 2024)
 Fixes:

- Fixed the bug where the slash menu internationalization failed


### v2.1.1 (March 29, 2024)
Fixes:

-Fixed the error in version number display

### v2.1.0 (March 29, 2024)

Added:

- Internationalization support, currently supports Chinese and English, [#6](https://github.com/suka233/siyuan-knote/issues/6)

### v2.0.0-beta.11 (February 22, 2024)

Optimization:

- Compatible with savor theme

### v2.0.0-beta.10 (February 22, 2024)

Added:

- Added slash menu, usage: input /info in the SiYuan editing area, then press enter, you can quickly insert the info style callout of knote; other types of knote insertion are similar, please check the plugin menu for details

Updated:

- Updated the default style created through knote; try /default + enter

### v2.0.0-beta.9 (February 21, 2024)

Added:

- Built-in callout types, fully compatible with the data of the savor callout plugin, now no other plugins are needed, ready to use out of the box~

### v2.0.0-beta.8

Added:

- After creating the day's diary through knote, it will automatically jump to that diary

### v2.0.0-beta.7

Added:

Added a human-readable timestamp attribute, thanks to [Hong Ge](https://github.com/zxhd863943427) for contributing code

### v2.0.0-beta.6

Fixed:

Fixed the stuttering problem caused by the has selector on some devices.

Thanks to the author of the [Flashcard Enhancement](https://github.com/zxhd863943427/siyuan-plugin-flash-enhance) plugin [Hong Ge](https://github.com/zxhd863943427) and [Fat Man](https://ld246.com/member/mozhu) and other big guys in the tinkering group for helping to locate and fix this defect, thank you

### v2.0.0-beta.5

Fixed:

Fixed the bug that clicking knote on the mobile end could not open the document and jump to the specified knote

Added:

Added the function of clicking on the date dividing line in the knote panel to jump to the specified daily note document

### v2.0.0-beta.4

Fixed:

1. Performance optimization: When SiYuan reloads, it will automatically destroy the global shortcut input box to avoid duplicate creation

Optimization:

1. When the web view plugin opens a new window, it does not create a global shortcut input box

Developer:

1. Optimized code, added log output of runtime calculation

### v2.0.0-beta.3

Fixed:

Fixed the bug of the layout compression of the KNote dock panel operation bar on the mobile end

### v2.0.0-beta.2

Added:

1. The global shortcut input box supports following the dark mode or day mode of the main interface

Note:

~~When SiYuan switches from day mode to dark mode, since the main window of SiYuan will reload all plugins, it will create an extra global shortcut input box, which does not affect the function, but it will occupy about 100mb of memory, and restarting SiYuan can solve it. PR welcome~~

It has been solved by me in v2.0.0-beta.4

### v2.0.0-beta

Refactoring:

1.Refactored the shortcut input box into an independent window, supporting global call-out and pinning to the desktop

Added:

1.The quick simple input box supports expanding into a full editor, naturally possessing all the native editing functions of SiYuan Notes, shortcut key shift+enter

2.Supports quick creation of today's diary document (to avoid synchronization coverage issues, it currently only supports manual creation)

3.If it's overnight, a statistical prompt and a new diary button will pop up in the upper right corner

Note:

1.This is a beta version, if there are bugs, please give feedback

2.Please set the specified notebook and display granularity and other settings in the dock bar, then use the global input function

### v1.3.0

Added:

1. Knote panel and quick input support dark mode adaptation

Optimization:

1. Organized code, optimized performance

### v1.2.0

Added:

1. Support for any format of daily note path type (experimental feature, please ensure SiYuan version 2.11.1+), needs to be manually enabled, the specific operation is as follows:
    1. Download and install the "Today's Note" plugin, it will guide you to fill in the missing diary properties
    2. Find KNote in the dock bar on the right side of SiYuan Notes, and then in the KNote settings panel, check "Enable new version query"
2. Added filter function, can filter out specific Callout types
3. Scroll to the specified date function: when the display granularity is all, switch the date, you can quickly scroll to the specified date in the KNote panel

### v1.1.0

Optimization:
1. Performance optimization, when there are too many Callouts, it will basically not stutter

Added:
1. Use Alt+left click on any KNote to hover and preview the detailed content of that KNote
2. Added the function of displaying all Callouts
3. Display Callouts in groups by date in the KNote panel
