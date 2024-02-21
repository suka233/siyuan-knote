import { colorMap } from '@/components/knoteDock/src/config'

export const useTheme = () => {
  let css = `
  [data-type='NodeBlockquote'].bq[updated][custom-b] > :first-child {
    font-weight: bold;
    padding-left: 2rem;
  }
  [data-type='NodeBlockquote'].bq[updated]::before {
      content: '';
      position: absolute;
      left: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  `
  const styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  styleElement.id = 'knote-color-map'

  // 根据colorMap生成css
  for (const key in colorMap) {
    if (colorMap.hasOwnProperty(key)) {
      const element = colorMap[key]
      css += `
      [data-type='NodeBlockquote'].bq[updated][custom-b='${key}'] > :first-child::before {
          background-color: ${element.mainColor};
          mask: url(/plugins/knote-plugin/img/${key}.svg) no-repeat center / contain;
      }
      [data-type='NodeBlockquote'].bq[updated][custom-b='${key}'] {
          border-left: 0.25rem solid ${element.mainColor};
          background-color:${element.secondaryColor};
      }
    `
    }
  }

  styleElement.innerHTML = css
  document.head.insertAdjacentElement('beforeend', styleElement)
}
