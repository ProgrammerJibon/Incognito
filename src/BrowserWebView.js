import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { Bar } from "react-native-progress";
import { Divider, Menu, Provider } from "react-native-paper";
import styles from "./Styles";
import {ActivityIndicator, Alert, BackHandler, StatusBar, TextInput, TouchableOpacity, View} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as Icon from "@fortawesome/free-solid-svg-icons";
import prompt from 'react-native-prompt-android';


let isValidHttpUrl=(str)=> {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}




let titleText;
let linkText;
const BrowserWebView = ({  }) => {


  const [webView, setWebView] = useState(null);
  const [webViewCanGoBack, setWebViewCanGoBack] = useState(false);

  const exit = () => {
    BackHandler.exitApp();
  }

  const webViewGOBack = ()=>{
    hideDropdown();
    if (webViewCanGoBack){
      webView.goBack();
    }else{
      exit();
      // if (navigation.canGoBack()){
      //   navigation.goBack();
      // }
    }
    return true;
  }


  BackHandler.addEventListener('hardwareBackPress', (e)=> {
    return webViewGOBack();
  });


  const [link, setLink] = useState("https://duckduckgo.com/");
  const [textField, setTextField] = useState("https://duckduckgo.com/");
  const [progress, setProgress] = useState(0);
  const [dropDown, setDropDown] = useState(false);
  let hideDropdown = ()=>setDropDown(false);
  return (
    <Provider style={styles.container}>
      <StatusBar
          backgroundColor={'red'}
          animated={true}
      />
      <View style={{flexDirection: "row", flexWrap: "wrap", alignSelf: "flex-start",width: "100%",}}>
        <View style={{flex: 1}}>
          <TextInput style={{padding: 16, color: 'gray'}} placeholderTextColor={'gray'} placeholder={"Enter URL"} value={textField} keyboardType={"url"} onChangeText={(e)=>{
            setTextField(e);
          }} onFocus={e => {
            setTextField(linkText);
          }} onBlur={e => {
            setTextField(titleText);
          }} onSubmitEditing={e=>{
            if (isValidHttpUrl(e.nativeEvent.text)){
              setLink(e.nativeEvent.text);
            }else{
              setLink("https://duckduckgo.com/?q="+encodeURI(e.nativeEvent.text));
            }
          }}
          ></TextInput>
        </View>
        <View style={{padding: 16, width: 50, height: 50,position: 'relative',top: 16, left: 0,right: 0, bottom: 0,justifyContent: 'center',alignItems: 'center'}}>
          <Menu
            visible={dropDown}
            onDismiss={hideDropdown}
            anchor={(<TouchableOpacity style={{marginTop: 16,}} onPress={()=>setDropDown(true)}><FontAwesomeIcon size={25} color='gray'  icon={ Icon.faEllipsisVertical } /></TouchableOpacity>)}>
            <Menu.Item onPress={() => {webView.reload();hideDropdown();}} title="Reload" />
            <Menu.Item onPress={() => {webViewGOBack()}} title="Backward" />
            <Menu.Item onPress={() => {webView.goForward();hideDropdown();}} title="Forward" />
            <Divider />
            <Menu.Item onPress={() => {/*if (navigation.canGoBack()){navigation.goBack();*/hideDropdown();exit();}} title="Close & Clear History" />
          </Menu>
        </View>
      </View>

      <Bar width={null} progress={progress} />
      <WebView
        ref={setWebView}
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        )}
        onNavigationStateChange={(e)=>{
          if (!e.loading){
            titleText = e.title;
            linkText = e.url;
          }
          setTextField(e.title);
          setWebViewCanGoBack(e.canGoBack);
        }}
        onScroll={event => {
          webView.requestFocus();
        }}
        source={{ uri: link }}
        style={styles.wevView}
        onError={(e)=>{
          e.preventDefault();
        }}
        injectedJavaScript={"document.querySelectorAll(\"*\").forEach((item)=>{if(item.classList.contains(\"header-wrap--home\") || item.classList.contains(\"foot-home\")){item.remove();}});\n"}
        onLoadProgress={e=>{
          setProgress(e.nativeEvent.progress);
        }}
      ></WebView>
    </Provider>
  );
};

export default BrowserWebView;
