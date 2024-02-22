import { colorMap } from '@/components/knoteDock/src/config'

export const useTheme = () => {
  let css = `
  [data-type='NodeBlockquote'].bq[updated][custom-b] > :first-child {
    font-weight: bold !important;
    padding-left: 2rem !important;
  }
  [data-type='NodeBlockquote'].bq[updated]::before {
      content: '' !important;
      position: absolute !important;
      left: 0 !important;
      width: 1.5rem !important;
      height: 1.5rem !important;
    }

  [data-type='NodeBlockquote'].bq[updated]::after {
      content: '' !important;
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
          background-color: ${element.mainColor} !important;
          mask: url(/plugins/knote-plugin/img/${key}.svg) no-repeat center / contain !important;
      }
      [data-type='NodeBlockquote'].bq[updated][custom-b='${key}'] {
          border-left: 0.25rem solid ${element.mainColor} !important;
          background-color:${element.secondaryColor} !important;
      }
    `
    }
  }

  styleElement.innerHTML = css
  document.head.insertAdjacentElement('beforeend', styleElement)
}
