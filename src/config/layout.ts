/*
 * @Author: 王大旭
 * @Date: 2023-04-24 15:46:56
 * @LastEditors: 王大旭
 * @LastEditTime: 2023-04-24 17:48:22
 * @Description:
 */
/** 布局配置 */
interface ILayoutSettings {
  /** 是否显示 Settings Panel */
  showSettings: boolean
  /** 是否显示标签栏 */
  showTagsView: boolean
  /** 是否显示侧边栏 Logo */
  showSidebarLogo: boolean
  /** 是否固定 Header */
  fixedHeader: boolean
  /** 是否显示消息通知 */
  showNotify: boolean
  /** 是否显示切换主题按钮 */
  showThemeSwitch: boolean
  /** 是否显示全屏按钮 */
  showScreenfull: boolean
  /** 是否显示灰色模式 */
  showGreyMode: boolean
  /** 是否显示色弱模式 */
  showColorWeakness: boolean
}

const layoutSettings: ILayoutSettings = {
  showSettings: false,
  showTagsView: true,
  fixedHeader: true,
  showSidebarLogo: false,
  showNotify: true,
  showThemeSwitch: false,
  showScreenfull: true,
  showGreyMode: false,
  showColorWeakness: false
}

export default layoutSettings
