# Jiuquan-er-Market-Bottom-Indicator

A China A-share market bottom-fishing signal.

## 抄底指数图

网页: <https://nobodysclown.github.io/Jiuquan-er-Market-Bottom-Indicator/>

一个韭圈儿风格的对比图,以 **2005年8月29日** 为基准,展示 **沪深300全收益指数** 与 **万得偏债混合型基金指数** 的累计收益率走势:

- 沪深300全收益指数 (H00300): 日线,数据来自 [中证指数公司官网](https://www.csindex.com.cn/zh-CN/indices/index-detail/H00300)
- 万得偏债混合型基金指数 (885003.WI): 免费渠道仅提供 2016年8月起周线 + 近1年日线,数据来自 [万得指数官网](https://www.windindices.com/)(更早历史需 Wind 终端,缺失段不显示)

页面默认以收益率为指标(基准日 2005-08-29),可切换为点位显示,并附当前点位、累计收益率和最大回撤统计。

## 数据更新

```bash
node scripts/fetch-data.mjs
```

脚本会从两个公开接口重新拉取数据,覆盖写入 `data/h00300.json` 和 `data/885003.json`。

## 文件结构

```
index.html            抄底指数图页面(静态,可直接部署到 GitHub Pages)
data/h00300.json      沪深300全收益指数日线 [date, close]
data/885003.json      万得偏债混合型基金指数(周线2016-08起 + 日线近1年)
scripts/fetch-data.mjs  数据下载脚本(Node.js,无依赖)
```
