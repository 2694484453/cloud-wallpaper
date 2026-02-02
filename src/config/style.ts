export default {
  showFooter: true,
  isSidebarCompact: false,
  showBreadcrumb: false,
  mode: import.meta.env.VITE_APP_THEME_MODE || 'light',
  layout: import.meta.env.VITE_APP_THEME_LAYOUT ?? 'side',
  splitMenu: false,
  isFooterAside: false,
  isSidebarFixed: true,
  isHeaderFixed: true,
  isUseTabsRouter: false,
  showHeader: true,
  brandTheme: '#0052D9',
};
