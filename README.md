# SSweb 丝袜库是公司常用基础库
Sweb is a JS prototype or an extension library of its own

SSweb (SW 被公司前端狗叫做丝袜库)是公司传统网页前端项目常用JS基础&工具库,由于使用频繁，前端早的小轮子

1、对于IE/6/7/8这种古董浏览器，丝袜库尝试检查并扩展ES5几个很常用原生方法

(trimLeft/trimRight/forEach/map/some/every/filter/indexOf/lastIndexOf/JSON)

2、实现了类似JQ的扩展插件机制（SSweb.extend/SSweb.fn.extend）

## 内置核心方法(baseMethod)

支持 sw(obj).function([parms]) 或 sw.function([parms]) 快捷调用

isUndefined/isFloat/isNaN/isNumber/isString/isArray

toInt/toFloat

isFunction/isCallFunction/inArray/isTrue/isEmpty/isObject/isEmptyObject/isPlainObject/isjQueryObject/isWindow/isDocument/isDomElement


## 内置常用工具方法(helpsMethod)
支持 sw.function([parms]) 快捷调用

trim/trimLeft/trimRight

arrayUnique  仿后端语言 删除数组中重复的元素 ,返回一个新数组

arrayRemove  仿后端语言 删除数组中指定的元素(如有多个全部移除),返回一个新数组

arrayUnset   仿后端语言删除数组中指定键对应某个元素,返回一个新数组

toPercent   转换百分数并保留两位小数

formatPercent   格式化保留两位小数转为百分比显示

formatBytesSize 格式化计算机字节数值为语义化表示字符串

formatMoney 格式化货币数值为语义化表示字符串

replaceValueMatch 替换字符串变量

dateFormat 对 UnixTime 日期进行格式化

urlGetParam  获取URL参数

urlAddParam  添加/覆盖URL参数

urlParse URL地址串解析

randomString 产生固定长度的随机字符串

## 内置 client  客户端/浏览器信息检测
sw.client 

## 内置 cookies  客户端/浏览器cookies管理组件

支持存储 对象、数组数据，统一以JSON格式存储，对于数值/布尔值支持原格式读取

sw.cookies.set(key, value)

sw.cookies.get(key)

sw.cookies.rm(key)

sw.cookies.clear()

## 内置 storage  客户端/浏览器localStorage管理组件

支持存储 对象、数组数据，统一以JSON格式存储，对于数值/布尔值支持原格式读取

sw.storage.set(key, value)

sw.storage.get(key)

sw.storage.rm(key)

sw.storage.clear()
