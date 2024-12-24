// 获取全局css:root
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = '';
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName);
  } catch (err) {
    console.error(err);
  }
  return cssVariableValue;
};
