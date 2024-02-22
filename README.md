# 思源笔记-knote 插件

>这里有比较详细的图文介绍：[https://ld246.com/article/1703831299597](https://ld246.com/article/1703831299597)

## 介绍
KNote的K意味着Keep，所以KNote的作用是帮助你持续记录

帮助你在思源中践行daily note笔记法，自动展示当天日记中的Callout内容，并且可以快捷键添加，跳转等

唤出快速添加输入框的快捷键：<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd> （帮助记忆:Q代表Quick，快速添加的意思）

欢迎进QQ群讨论：130584094

## 使用
安装好KNote插件后，在右侧dock栏中会出现一个KNote的图标，点击即可唤出KNote的面板，然后点击面板内的设置按钮，设置指定的笔记本，即可自动刷新

具体可以看这里：[https://ld246.com/article/1703831299597](https://ld246.com/article/1703831299597)

## 限制
1.~~目前仅仅支持标准格式的daily note,即如果你没有更改过daily note的路径,那么这个插件就可以正常使用，或者日记的路径格式为形似如下这种：`/daily note/年-月-日`,那么应该也能正常使用。之后会慢慢适配其它路径格式的daily note~~
感谢f佬，由于f佬的新提案，现在任意路径的daily note都可以正常使用了！（实验性功能，请确保思源版本2.11.1+，并且下载并安装 “今日笔记” 插件，它会指引你帮你补齐以前缺失的日记属性）

2.~~推荐和[Savor Callout插件](https://github.com/frostime/sy-bq-callout)一起使用，这样可以获得完整体验，~~ （2024年2月21日新加：目前已经内置callout类型，开箱即用~）后期会推出自定义Callout类型的支持

3.此为初版，仅在win11桌面端思源测试通过，~~当天的Callout太多的话，可能会存在性能问题~~（已经优化过性能[v1.1.0+]，欢迎反馈），欢迎提出建议
## 其它
为什么要做这个插件？

我很认同的一句话是：列出你自己每天接收信息的来源。找出一个你认为最方便的方法把你从这些信息源读到的有价值的内容保存下来，然后想清楚它最终应该流向什么地方

流向的地方当然是我最爱的思源笔记，但是最方便的方法？ok，是时候开发全平台的KNote了。目前独立桌面端的开发进度为70%，支持全局添加，同步思源Callout,固定至桌面等等功能，如果你感兴趣，欢迎进入QQ群讨论

## 更新日志

### v2.0.0-beta.11(2024年2月22日)

优化：

- 兼容savor主题

### v2.0.0-beta.10(2024年2月22日)

新增：

- 新增斜杠菜单，使用方法：在思源编辑区输入/info，然后回车，即可快速插入knote的info样式callout；其它类型的knote插入方式也类似，具体请查看插件菜单

更新：

- 更新通过knote创建的default样式；试试/default+回车吧


### v2.0.0-beta.9(2024年2月21日)

新增：

- 内置callout类型，完全兼容savor callout插件的数据，现在无需其它插件配合，开箱即用~

### v2.0.0-beta.8

新增：

- 通过knote新建当天的日记之后，会自动跳转到该日记

### v2.0.0-beta.7

新增：

新增人类可读的时间戳属性，感谢[弘哥](https://github.com/zxhd863943427)贡献代码

### v2.0.0-beta.6

修复：

修复在某些设备上has选择器造成的卡顿问题。

感谢[闪卡增强](https://github.com/zxhd863943427/siyuan-plugin-flash-enhance)插件作者[弘哥](https://github.com/zxhd863943427)和[胖佬](https://ld246.com/member/mozhu)和折腾群里其他大佬帮助定位和修复此缺陷，谢谢你们


### v2.0.0-beta.5

修复：

修复移动端点击knote无法打开文档并跳转到指定knote的bug

新增：

新增点击knote面板中的日期分割线，可以跳转到指定的daily note文档的功能

### v2.0.0-beta.4

修复：

1. 性能优化：思源重载的时候，会自动销毁全局快捷输入框，避免重复创建

优化：

1. 网页视图插件打开新窗口的时候，不创建全局快捷输入框

开发者：

1. 优化代码，新增计算运行时间的日志输出

### v2.0.0-beta.3

修复：

修复手机端KNote的dock面板操作栏布局压缩的bug

### v2.0.0-beta.2

新增：

1. 全局快捷输入框支持跟随主界面的黑暗模式or白天模式

注意：

~~当思源从白天模式切换到黑暗模式时，由于思源主窗口会重载所有插件，导致额外创建一个全局快捷输入框，功能无影响，但是会占用100mb左右的内存，重启思源即可解决。PR welcome~~

已经在 v2.0.0-beta.4 中被我解决啦

### v2.0.0-beta

重构：

1.重构快捷输入框为独立的窗口，支持全局唤出，支持固定至桌面

新增：

1.快捷简易输入框支持展开为完整编辑器，天然具备思源笔记的所有原生编辑功能，快捷键shift+enter

2.支持快捷创建今日日记文档（为了避免同步覆盖的问题，暂时只支持手动创建）

3.隔夜的话，会在右上角弹出统计提示和新建日记按钮

注意：

1.此为beta版，有bug欢迎反馈

2.请在dock栏中设置好指定的笔记本和展示粒度等等设置项，再使用全局输入的功能


### v1.3.0

新增：

1. knote面板和quick input支持黑暗模式适配

优化：

1. 整理代码，优化性能

### v1.2.0

新增：

1. 支持任意格式的daily note路径类型（实验性功能，请确保思源版本2.11.1+），需要手动开启，具体操作如下：
    1. 下载并安装 “今日笔记” 插件，它会指引你帮你补齐以前缺失的日记属性
    2. 在思源笔记右侧的dock栏中找到KNote，然后在KNote设置面板中，勾选“启用新版查询”即可
2. 新增筛选功能，可以筛选出指定的Callout类型
3. 滚动到指定日期功能：当展示粒度为全部的时候，切换日期，可以在KNote面板中快速滚动到指定日期

### v1.1.0

优化：
1. 性能优化，当Callout过多时，基本不会卡顿

新增：
1. 使用Alt+左键单击任意一条KNote，即可悬浮预览该条KNote的详细内容
2. 新增显示所有Callout的功能
3. KNote面板中按日期分组显示Callout
