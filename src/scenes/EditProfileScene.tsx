import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput as TextInputType,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import { ErrorPage } from '../components';
import { COLORS } from '../constants/colors';
import {
  defaultButton,
  defaultButtonLabel,
  flatTextInputContainerStyle,
  flatTextInputStyle,
  textInputLabel,
} from '../constants/theme';
import { Button, KeyboardAvoidingView, TextInput } from '../core-ui';
import { ScreenSize, useDimensions } from '../helpers/dimensions';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import {
  useGetAuthenticatedUser,
  useSetAuthenticatedUser,
} from '../hooks/api/useAuthenticatedUser';
import { useUpdateCustomer } from '../hooks/api/useCustomer';
import { StackNavProp, StackRouteProp } from '../types/Navigation';

export default function EditProfileScene() {
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [phoneNumber, setPhoneNumber] = useState('');
  let [password, setPassword] = useState('');
  let [isEmailValid, setIsEmailValid] = useState(true);
  let [isPasswordValid, setIsPasswordValid] = useState(true);
  let [expiresAt, setExpiresAt] = useState('');
  let lastNameRef = useRef<TextInputType>(null);
  let emailRef = useRef<TextInputType>(null);
  let phoneNumberRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);
  let { screenSize } = useDimensions();
  let { goBack } = useNavigation<StackNavProp<'EditProfile'>>();
  let {
    params: { customerAccessToken },
  } = useRoute<StackRouteProp<'EditProfile'>>();

  let containerStyle = () => {
    if (screenSize === ScreenSize.Small) {
      return styles.container;
    } else {
      return [styles.container, { marginHorizontal: 36 }];
    }
  };
  let saveChanges = () => {
    if (password === '') {
      updateCustomerData({
        variables: {
          email,
          customerAccessToken,
          firstName,
          lastName,
        },
      });
    } else {
      updateCustomerData({
        variables: {
          email,
          customerAccessToken,
          firstName,
          lastName,
          password,
        },
      });
    }
  };

  let { setUser } = useSetAuthenticatedUser();
  let { loading: saving, updateCustomerData } = useUpdateCustomer({
    onCompleted: ({ customerUpdate }) => {
      if (customerUpdate && customerUpdate.customer) {
        let { email, firstName, id, lastName } = customerUpdate.customer;
        if (email && firstName && lastName) {
          setUser({
            variables: { user: { email, expiresAt, lastName, id, firstName } },
          });
        }
      }
      goBack();
    },
  });

  let {
    loading: getAuthenticatedUserLoading,
    error,
    refetch,
  } = useGetAuthenticatedUser({
    onCompleted({ authenticatedUser }) {
      let { email, firstName, lastName, expiresAt } = authenticatedUser;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setExpiresAt(expiresAt);
    },
  });

  if (error) {
    return <ErrorPage onRetry={refetch} />;
  }

  if (getAuthenticatedUserLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  let isDisabled =
    !firstName || !lastName || !email || password.length > 0
      ? !isPasswordValid
      : false || !isEmailValid;
  return (
    <KeyboardAvoidingView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={containerStyle()}>
          <View style={styles.formsContainer}>
            <TextInput
              label={t('First Name')}
              labelStyle={textInputLabel}
              autoFocus={true}
              clearTextOnFocus={false}
              autoCapitalize="none"
              textContentType="name"
              mode="flat"
              value={firstName}
              onChangeText={setFirstName}
              returnKeyType="next"
              onSubmitEditing={() => {
                lastNameRef.current && lastNameRef.current.focus();
              }}
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
            <TextInput
              ref={lastNameRef}
              label={t('Last Name')}
              labelStyle={textInputLabel}
              autoFocus={true}
              clearTextOnFocus={false}
              autoCapitalize="none"
              textContentType="name"
              mode="flat"
              value={lastName}
              onChangeText={setLastName}
              returnKeyType="next"
              onSubmitEditing={() => {
                emailRef.current && emailRef.current.focus();
              }}
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
            <TextInput
              onFocus={() => {
                setIsEmailValid(true);
              }}
              onBlur={() => {
                setIsEmailValid(validateEmail(email));
              }}
              clearTextOnFocus={false}
              autoCapitalize="none"
              errorMessage={!isEmailValid ? INVALID_EMAIL_MESSAGE : undefined}
              ref={emailRef}
              label={t('Email Address')}
              labelStyle={textInputLabel}
              textContentType="emailAddress"
              mode="flat"
              value={email}
              onChangeText={setEmail}
              errorMessageStyle={styles.errorMessage}
              returnKeyType="next"
              onSubmitEditing={() => {
                phoneNumberRef.current && phoneNumberRef.current.focus();
              }}
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
            <TextInput
              clearTextOnFocus={false}
              ref={phoneNumberRef}
              label={t('Phone Number')}
              labelStyle={textInputLabel}
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              mode="flat"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current && passwordRef.current.focus();
              }}
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
            <TextInput
              onFocus={() => {
                setIsPasswordValid(true);
              }}
              onBlur={() => {
                if (password.length > 0) {
                  setIsPasswordValid(validatePassword(password));
                }
              }}
              ref={passwordRef}
              textContentType="password"
              autoCapitalize="none"
              errorMessage={
                !isPasswordValid ? INVALID_PASSWORD_MESSAGE : undefined
              }
              label={t('Password')}
              labelStyle={textInputLabel}
              secureTextEntry={true}
              mode="flat"
              value={password}
              onChangeText={setPassword}
              errorMessageStyle={styles.errorMessage}
              returnKeyType="done"
              containerStyle={flatTextInputContainerStyle}
              style={flatTextInputStyle}
            />
          </View>
          <Button
            disabled={isDisabled}
            onPress={saveChanges}
            loading={saving}
            style={[defaultButton, styles.buttonSaveContainer]}
            labelStyle={defaultButtonLabel}
          >
            {!saving && t('Save Changes')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    marginHorizontal: 24,
    justifyContent: 'space-between',
    flexGrow: 2,
  },
  formsContainer: {
    marginVertical: 12,
    alignSelf: 'flex-start',
    width: '100%',
  },
  buttonSaveContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
