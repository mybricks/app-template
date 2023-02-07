import servicePlugin, {mock} from "@mybricks/plugin-connector-http";
import debugTool from "@mybricks/plugin-tools";
import {render as renderCom} from "@mybricks/render-com";
import React from "react";

import {File} from '@mybricks/sdk-for-app/api'

export default function ({fileId}) {
  return {
    plugins: [servicePlugin(), debugTool()],
    comLibLoader(desc) {//加载组件库
      return new Promise((resolve, reject) => {
        const pageContent = window.localStorage.getItem('--mybricks--')
        if (pageContent) {
          const json = JSON.parse(pageContent)

          if (json.comlibs) {
            const libs = json.comlibs.map(lib => {
              if (lib.content) {
                return lib.content
              }
            }).filter(a => a)

            resolve(libs)

            return
          }
        }

        //加载组件库
        resolve([
          'https://f2.eckwai.com/kos/nlav12333/fangzhou/pub/comlibs/586_1.7.34-beta.2/2023-01-31_14-12-41/edit.js',
          //...window['__comlibs_edit_']
        ])
      })
    },
    editView: {
      editorAppender(editConfig) {
        //return PcEditor({editConfig, projectData: {}} as any)
      },
      items({}, cate0, cate1, cate2) {
        cate0.title = `定制项目`
        cate0.items = [
          () => {
            return (
              <div>TODO</div>
            )
          }
        ]
      }
    },
    pageContentLoader() {//加载页面内容
      return File.getContent(fileId)
    },
    // geoView: {
    //   nav: {float: false},
    // },
    toplView: {
      cards: {
        main: {
          title: '组件',
          ioEditable: true
        }
      },
      fx: {}
    },
    com: {//组件运行配置
      env: {
        hasPermission() {
          return true
        },
        i18n(title) {//多语言
          return title
        },
        vars: {
          getQuery(name) {
            return 'a'////temp
          },
        },
        renderCom,
        callConnector(connector, params) {//调用连接器
          if (connector.type === 'http') {//服务接口类型
            return mock(connector, params, {
              // 发送请求前的钩子函数
              before(options) {
                return {
                  ...options
                }
              }
            })
          } else {
            return Promise.reject('错误的连接器类型.')
          }
        },
        events: [//配置事件
          {
            type: 'jump',
            title: '跳转到',
            exe({options}) {
              const page = options.page
              if (page) {
                window.location.href = page
              }
            },
            options: [
              {
                id: 'page',
                title: '页面',
                editor: 'textarea'
              }
            ]
          },
        ]
      },
    },
  }
}