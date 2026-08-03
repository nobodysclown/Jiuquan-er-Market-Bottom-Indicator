# Jiuquan-er-Market-Bottom-Indicator

A China A-share market bottom-fishing signal.

## 抄底指数图

网页: <https://nobodysclown.github.io/Jiuquan-er-Market-Bottom-Indicator/>

一个韭圈儿风格的对比图,将 **沪深300全收益指数** 与 **万得偏债混合型基金指数** 的近 1 年点位放在同一张图里:

- 沪深300全收益指数 (H00300): 日线,数据来自 [中证指数公司官网](https://www.csindex.com.cn/zh-CN/indices/index-detail/H00300)
- 万得偏债混合型基金指数 (885003.WI): 免费渠道仅提供近 1 年日线,数据来自 [万得指数官网](https://www.windindices.com/)(更早历史需 Wind 终端)

页面显示近 1 年点位走势,并附当前点位、近 1 年涨跌幅和最大回撤统计。

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
