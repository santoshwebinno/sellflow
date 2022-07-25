import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from "react-native-paper";

import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerContentComponentProps
} from "@react-navigation/drawer";

import { IconButton, useTheme } from 'react-native-paper'; 
import { menus } from "../fixtures/MainMenuItemData";
import AccordionListItem from "../components/AccordionListItem";
import { DrawerActions } from '@react-navigation/native';



export function DrawerContent( props: any) {
let { navigation } = props;
    const onCloseDrawer = () => {
       // console.log(navigation);
        navigation.dispatch(DrawerActions.closeDrawer());
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={{
                justifyContent: "flex-end",
                flexDirection: "row"
            }}>
                <IconButton
                    icon={"close"}
                    onPress={() => onCloseDrawer()}
                    color={"#677279"}
                    style={[styles.headerButton]}
                />
            </View>
            <DrawerContentScrollView {...props}>

                <View style={{
                    margin: 12
                }}>
                    <DrawerItem
                        label="Close drawer"
                        onPress={() => props.navigation.closeDrawer()}
                    />
                     {menus.map((item) => {
                        return <AccordionListItem collection={item} navigation={navigation} title={item.title} key={item.id} handle={item.handle}>
                            {item.submenuItems && item.submenuItems.length > 0 &&
                                item.submenuItems.map((subMenus) => {
                                    return <AccordionListItem collection={subMenus} navigation={navigation} title={subMenus.title} key={subMenus.id} handle={item.handle}>
                                        {subMenus.submenuItems && subMenus.submenuItems.length > 0 &&
                                            subMenus.submenuItems.map((subsubMenus) => {
                                                return <AccordionListItem collection={subsubMenus} navigation={navigation} title={subsubMenus.title} key={subsubMenus.id} handle={item.handle}>
                                                    <Text>{subsubMenus.title}</Text>
                                                </AccordionListItem>
                                            })}
                                    </AccordionListItem>
                                })
                            }
                        </AccordionListItem>
                    })} 
                </View>
                </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomDrawerSection: {
        marginBottom: 150,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    headerButton: {
        marginRight: 8,
    }
})