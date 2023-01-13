'use strict';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16
  },
  wevView: {
    flex: 1
  },
  h1: {
    fontSize: 40,
    padding: 16,
    width: null,
    color: "red"
  },
  center:{
    textAlign: "center"
  },
  img: {
    width: "100%",

  },
  btn:{
    padding: 8,
    textAlign: "center",
    color: 'white',
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "red",
    borderColor: "red",
    borderRadius: 50,
    borderWidth: 5,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    marginVertical: 8,

  },
  input :{
    borderColor: "red",
    borderRadius: 50,
    borderWidth: 5,
    color: 'red',
    padding: 16,
    marginVertical: 8
  },
  span :{
    color: "gray",
    borderColor: 'red',
    padding: 8
  }
});
export default styles;
