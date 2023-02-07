import React, {useCallback, useRef, useState} from "react";
import {message} from "antd";
import css from "./css.less";

import {View, Toolbar} from '@mybricks/sdk-for-app/ui'

import Designer from '@mybricks/designer-spa';
import appConfig from './app-config'

import {File} from '@mybricks/sdk-for-app/api'

export default function MyDesigner() {
  const [appData, setAppDate] = useState({
    fileId: void 0
  })

  const designerRef = useRef<{ switchActivity, getAllComDef, dump, toJSON, getPluginData }>()

  const save = useCallback(() => {//保存
    const json = designerRef.current?.dump()

    File.save(appData.fileId, {content: json}).then(v => {
      message.info(`保存完成`)
    })
  }, [])

  const preview = useCallback(() => {
    const json = designerRef.current?.toJSON()

    window.localStorage.setItem('--preview--', JSON.stringify(json))

    const win = window.open('', 'preview');
    if (win.location.href === "about:blank") {
      window.open('/preview.html', 'preview')
    } else {
      win.focus()
    }

  }, [])

  const publish = useCallback(() => {
    const title = '我的页面'//页面标题
    const json = designerRef.current?.toJSON()

    let html = htmlTpt.replace(`--title--`, title)//替换
    html = html.replace(`'-projectJson-'`, JSON.stringify(json))//替换

    //-----------------------------------------------

    const linkNode = document.createElement('a')
    linkNode.download = `${title}.html`
    linkNode.style.display = 'none'
    const blob = new Blob([html])
    linkNode.href = URL.createObjectURL(blob)

    document.body.appendChild(linkNode)
    linkNode.click()

    document.body.removeChild(linkNode)
  }, [])

  const onMessage = useCallback((type, msg) => {
    message.destroy()
    message[type](msg)
  }, [])

  return (
    <View onLoad={(appData) => {
      setAppDate(appData)

      return (
        <>
          <Toolbar btns={(
            <>
              <button className={css.primary} onClick={save}>保存</button>
              <button onClick={preview}>预览</button>
              <button onClick={publish}>发布到本地</button>
            </>
          )}/>
          <Designer config={appConfig({
            fileId: appData.fileId
          })} ref={designerRef} onMessage={onMessage}/>
        </>
      )
    }}/>
  )
}