import React, {useState} from "react";
import {WebView} from "react-native-webview";
import {Bar} from "react-native-progress";
import {Divider, Menu, Provider} from "react-native-paper";
import styles from "./Styles";
import {
    Alert,
    BackHandler,
    RefreshControl,
    ScrollView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import * as Icon from "@fortawesome/free-solid-svg-icons";


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
    Alert.alert(
        'Exit App',
        'Do you want to exit?\nAll site data like cookies, history and caches will be removed.',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: () => {
                  webView.clearCache();
                  webView.clearFormData();
                  webView.clearHistory();
                  BackHandler.exitApp();
              }},
        ],
        { cancelable: true });

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
    const [scrollPositionWebView, setScrollPositionWebView] = useState(0);
    let hideDropdown = ()=>setDropDown(false);
  return (
    <Provider style={[styles.container]}>
      <StatusBar
          backgroundColor={'red'}
          animated={true}
      />
      <View style={{position: 'relative', flexDirection: "row", flexWrap: "wrap", alignSelf: "flex-start",width: "100%", backgroundColor: 'red'}}>
        <View style={{flex: 1}}>
          <TextInput style={{padding: 16, color: 'white', backgroundColor: 'red'}} placeholderTextColor={'gray'} placeholder={"Enter URL"} value={textField} keyboardType={"url"} onChangeText={(e)=>{
            setTextField(e);
          }} onFocus={e => {
            setTextField(linkText);
          }} onBlur={e => {
            setTextField(titleText);
          }} onPressIn={()=>{
              setTextField(linkText);
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
            contentStyle={{ backgroundColor: 'darkred'}}
            anchor={(<TouchableOpacity style={{marginTop: 16}} onPress={()=>setDropDown(true)}><FontAwesomeIcon size={25} color='white'  icon={ Icon.faEllipsisVertical } /></TouchableOpacity>)}>
            <Menu.Item titleStyle={{color: "white"}}  leadingIcon="reload" onPress={() => {webView.reload();hideDropdown();}} title="Reload" />
            <Menu.Item titleStyle={{color: "white"}}  leadingIcon="arrow-left" onPress={() => {webViewGOBack()}} title="Backward" />
            <Menu.Item titleStyle={{color: "white"}}  leadingIcon="arrow-right" onPress={() => {webView.goForward();hideDropdown();}} title="Forward" />
            <Divider />
            <Menu.Item titleStyle={{color: "white"}}  leadingIcon="location-exit" onPress={() => {/*if (navigation.canGoBack()){navigation.goBack();*/hideDropdown();exit();}} title="Exit" />
          </Menu>
        </View>
          <Bar
              style={[{position: 'absolute', bottom: 0, left: 0, right: 0}]}
              width={null}
              color={'white'}
              borderRadius={0}
              height={(progress > 0) ? 5 : 0}
              animationType={'spring'}
              indeterminate={(progress > 0.01 && progress < 0.25)}
              borderWidth={0}
              progress={progress}/>
      </View>


      <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'black' }}
          refreshControl={(
              <RefreshControl
                  enabled={(scrollPositionWebView < 1)}
                  onRefresh={()=>{
                      if (scrollPositionWebView < 1){
                          webView.reload();
                      }
                  }}
                  refreshing={(progress > 0.01 && progress < 0.3)}
              />
          )}
      >
        <WebView
            incognito={true}
            bounces={true}
            mixedContentMode={'always'}
            ref={setWebView}
            onNavigationStateChange={(e)=>{
              if (!e.loading){
                titleText = e.title;
                linkText = e.url;
                  setTextField(e.title);
              }else{
                  setTextField(e.url);
              }
              setWebViewCanGoBack(e.canGoBack);
            }}
            onScroll={event => {
              webView.requestFocus();
              setScrollPositionWebView(event.nativeEvent.contentOffset.y);
            }}
            source={{ uri: link }}
            style={[styles.wevView, {backgroundColor:'transparent'}]}
            onError={(e)=>{
              e.preventDefault();
            }}
            injectedJavaScript={"document.querySelectorAll(\"*\").forEach((item)=>{if(item.classList.contains(\"header-wrap--home\") || item.classList.contains(\"foot-home\")){item.remove();}});\n"}
            onLoadProgress={e=>{
              setProgress(e.nativeEvent.progress);
              if (e.nativeEvent.progress === 1){
                  setProgress(0);
              }
            }}
        ></WebView>
      </ScrollView>

    </Provider>
  );
};

export default BrowserWebView;
