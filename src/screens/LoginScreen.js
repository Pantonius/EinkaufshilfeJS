import {
  StyleSheet, ToastAndroid,
  ScrollView, View,
  TextInput, Image, TouchableOpacity,
  Text, Pressable } from "react-native";
import { useState, useEffect } from "react";

import { CommonStyles } from '../style/CommonStyles';
import * as CommonColors from '../style/CommonColors';

import {
  createUserWithEmailAndPassword,
  AuthErrorCodes, signInWithEmailAndPassword,
  onAuthStateChanged, sendEmailVerification, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../util/firebase";


export default function LoginScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');
  
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();

  const [loginScreen, isLoginScreen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => user && navigation.replace('Home'));

    return unsubscribe;
  }, []);

  useEffect(() => {
    setEmailError();
    setPasswordError();

  }, [email, password, controlPassword, loginScreen])

  const handleError = (error) => {
    console.log(error.code);

    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        setEmailError('Die Email ist bereits mit einem Profil verknüpft!');
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        setPasswordError('Falsches Passwort!');
        break;
      case 'auth/missing-email':
        setEmailError('Email wurde nicht angegeben!');
        break;
      case AuthErrorCodes.USER_DELETED:
        setEmailError('Es wurde kein Nutzer mit dieser Email gefunden!')
        break;
      default:
        break;
    }
  }

  const handleSignUp = () => {
    if(password === controlPassword) {
      createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;

        // Display Name
        updateProfile(auth.currentUser, { displayName: displayName });

        console.log('Signed Up with: ' + user.email);

        // Verification
        sendEmailVerification(user).then(() => {
          ToastAndroid.show('Eine Bestätigungsemail wurde verschickt!', ToastAndroid.LONG, ToastAndroid.CENTER);
        });
      })
      .catch(error => handleError(error));
    } else {
      setPasswordError('Die Passwörter stimmen nicht überein!');
    }
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ' + user.email);
      })
      .catch(error => handleError(error));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />
      
      <View style={styles.form}>
        {!loginScreen && <TextInput style={styles.textInput} placeholder={'Anzeigename'} value={displayName} onChangeText={text => setDisplayName(text)} /> }

        <TextInput style={[styles.textInput, { borderColor: emailError && 'red', borderWidth: emailError && 2 }]} placeholder={'Email'} value={email} onChangeText={text => setEmail(text)} />
        
        { // EMAIL ERROR
          emailError && <Text style={styles.errorText}>{emailError}</Text>
        }

        <TextInput style={[styles.textInput, { borderColor: passwordError && 'red', borderWidth: passwordError && 2 }]} placeholder={'Passwort'} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} />
          
        { // PASSWORD RESET
          loginScreen && <Pressable onPress={() => {
            sendPasswordResetEmail(auth, email).then(() => {
              ToastAndroid.show('Wiederherstellungsemail wurde verschickt!', ToastAndroid.LONG, ToastAndroid.CENTER);
            }).catch(error => handleError(error));
          }}>
            <Text style={{ marginLeft: 8, marginBottom: 16, }}>Passwort vergessen</Text>
          </Pressable>
        }

        { // SIGNIN
          !loginScreen && <TextInput style={[styles.textInput, { borderColor: passwordError && 'red', borderWidth: passwordError && 2 }]} placeholder={'Passwort (nochmal)'} value={controlPassword} onChangeText={text => setControlPassword(text)} secureTextEntry={true} />
        }
          
        { // PASSWORD ERROR
          passwordError && <Text style={styles.errorText}>{passwordError}</Text>
        }

        { // LOGIN BUTTON
          loginScreen ? <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={() => {
              handleLogin();
            }}>
              <Text style={CommonStyles.buttonText}>Einloggen</Text>
            </TouchableOpacity>

            <Pressable onPress={() => isLoginScreen(false)}>
              <Text style={{ color: CommonColors.neutral }}>Registrieren</Text>
            </Pressable>
          </View>
        :
          // SIGNIN BUTTOn
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={() => {
              handleSignUp();
            }}>
              <Text style={CommonStyles.buttonText}>Registrieren</Text>
            </TouchableOpacity>

            <Pressable onPress={() => isLoginScreen(true)}>
              <Text style={{ color: CommonColors.neutral }}>Einloggen</Text>
            </Pressable>
          </View>
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  logo: {
    alignSelf: 'center',
    width: 450,
    height: 450,
    marginTop: '10%',
  },

  form: {
    ...CommonStyles.card,
    borderRadius: 16,
    margin: 0,
    marginTop: 'auto',
    paddingVertical: 24,
  },

  button: {
    backgroundColor: CommonColors.positive,
    ...CommonStyles.button
  },

  textInput: {
    ...CommonStyles.card,
    backgroundColor: '#DBEEF9',
  },

  errorText: {
    marginLeft: CommonStyles.card.margin,
    marginRight: CommonStyles.card.margin,
    color: 'red'
  },
});