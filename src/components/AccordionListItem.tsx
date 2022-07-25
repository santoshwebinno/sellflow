import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
  Linking
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { CategoryItem } from '../types/types';
import { DrawerActions } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavProp } from '../types/Navigation';
type AccordionItemProps = {
    title: string;
    children: any;
    handle: string;
    navigation: any,
    collection: any
};

const AccordionListItem = (props: AccordionItemProps) => {
  // let { navigate } = useNavigation<StackNavProp<'Home'>>();
    const [open, setOpen] = useState(false);
    const animatedController = useRef(new Animated.Value(0)).current;
    const [bodySectionHeight, setBodySectionHeight] = useState<number>(0);
  
    const bodyHeight = animatedController.interpolate({
      inputRange: [0, 1],
      outputRange: [0, bodySectionHeight],
    });
  
    const arrowAngle = animatedController.interpolate({
      inputRange: [0, 1],
      outputRange: ['0rad', `${Math.PI}rad`],
    });
    const navigateCollection = (collection:any) => {
    //  props.navigation.navigate("Home");
    props.navigation.dispatch(DrawerActions.closeDrawer())
      props.navigation.navigate('ProductCollection', {collection});
      
    } 
    const toggleListItem = () => {
      if (open) {
        Animated.timing(animatedController, {
            duration: 300,
            toValue: 0,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false
        }).start();
      } else {
        Animated.timing(animatedController, {
            duration: 300,
            toValue: 1,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false
        }).start();
      }
      setOpen(!open);
    };
    return (
      <>
        <TouchableWithoutFeedback>
          <View style={styles.titleContainer}>
            <Text onPress={() => navigateCollection(props.collection)}>{props.title}</Text>
            <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
            <IconButton
                    icon={"menu-down"}
                    onPress={() => toggleListItem()}
                    color={"black"}
                    size={20}
                />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
          <View
            style={styles.bodyContainer}
            onLayout={event =>
              setBodySectionHeight(event.nativeEvent.layout.height)
            }>
            {props.children}
          </View>
        </Animated.View>
      </>
    );
  };

export default AccordionListItem;

const styles = StyleSheet.create({
    bodyBackground: {
      backgroundColor: '#EFEFEF',
      overflow: 'hidden',
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingLeft: 24,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#EFEFEF',
    },
    bodyContainer: {
      padding: 16,
      paddingLeft: 24,
      position: 'absolute',
      bottom: 0,
    },
  });
  