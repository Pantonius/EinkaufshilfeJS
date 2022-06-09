import { ToastAndroid, StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { CommonStyles } from '../style/CommonStyles';
import * as CommonColors from '../style/CommonColors';
import Divider from '../components/Divider';

import { auth } from '../util/firebase';
import { signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import LoadingIndicator from '../components/LoadingIndicator';

export default function AccountScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);

  const [changePassword, showChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');

  const [loadingPassword, isLoadingPassword] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if(user !== null) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setVerified(user.emailVerified);
    }
  }, []);

  const reauth = (password, onSuccess, onError) => {
    signOut(auth);
    signInWithEmailAndPassword(auth, auth.currentUser.email, password)
      .then(userCredentials => onSuccess && onSuccess(userCredentials))
      .catch(error => onError && onError(error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePicture}>
        <FontAwesome5Icon name='user' style={{ fontSize: 128, }} />
      </View>

      <View style={styles.form}>
        <TextInput placeholder={'Benutzername'} value={displayName} style={styles.textInput} onChangeText={displayName => setDisplayName(displayName)} />
        <View style={{ ...CommonStyles.hbox, ...styles.textInput }}>
          <TextInput placeholder={'Email'} value={email} onChangeText={email => setEmail(email)} editable={false} />
          { verified && <FontAwesome5Icon name='check' style={{ fontSize: 18, alignSelf: 'center', marginLeft: 'auto', color: CommonColors.neutral }} /> }
        </View>

        <Divider />
        
        { // CHANGE PASSWORD
        !changePassword ?
          // Hide
          <TouchableOpacity style={styles.formButton} onPress={() => showChangePassword(!changePassword)}>
            <Text style={CommonStyles.buttonText}>Passwort ändern</Text>
          </TouchableOpacity>

          :

          // Show
          <View>
            <TextInput placeholder='Altes Passwort' style={styles.textInput} value={oldPassword} secureTextEntry={true} onChangeText={password => setOldPassword(password)} />
            <TextInput placeholder='Neues Passwort' style={styles.textInput} value={newPassword} secureTextEntry={true} onChangeText={password => setNewPassword(password)} />
            <TextInput placeholder='Neues Passwort (nochmal)' style={styles.textInput} value={controlPassword} secureTextEntry={true} onChangeText={password => setControlPassword(password)} />
            

            <TouchableOpacity style={styles.formButton} onPress={() => {
              isLoadingPassword(true);

              reauth(oldPassword, userCredentials => {
                console.log(JSON.stringify(userCredentials));

                if(newPassword === controlPassword)
                    updatePassword(auth.currentUser, newPassword).then(() => {
                      ToastAndroid.show('Passwort wurde geändert', ToastAndroid.SHORT, ToastAndroid.CENTER);
                      
                      setNewPassword('');
                      setOldPassword('');
                      setControlPassword('');

                      showChangePassword(false);
                      isLoadingPassword(false);
                    }).catch(error => {
                      console.log(error);
                      isLoadingPassword(false);
                    });
              }, (error) => console.log(error));
            }}>
              {loadingPassword ? <LoadingIndicator baseColor={CommonColors.neutral} accentColor={'white'} /> : 
                <Text style={CommonStyles.buttonText}>Passwort ändern</Text>
              }
            </TouchableOpacity>
          </View>
        }
      </View>

      <TouchableOpacity style={CommonStyles.button} onPress={() => {
        if(displayName != auth.currentUser.displayName) {
          updateProfile(auth.currentUser, { displayName: displayName }).then(() => {
            ToastAndroid.show("Der Benutzername wurde aktualisiert!", ToastAndroid.LONG, ToastAndroid.CENTER);
          }).catch(error => {
            console.log(error);
          });
        }

        if(email != auth.currentUser.email) {
          reauth(oldPassword, () => {
            updateEmail(auth.currentUser, email).then(() => {
              ToastAndroid.show("Die Email wurde aktualisiert!", ToastAndroid.LONG, ToastAndroid.CENTER);
            }).catch(error => {
              console.log(error);
            });
          }, (error) => console.log(error));
        }

        navigation.goBack();
      }}>
        <Text style={CommonStyles.buttonText}>Speichern</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
  },

  profilePicture: {
    backgroundColor: 'white',
    width: 196,
    height: 196,
    borderRadius: 120,
    padding: 32,
    alignItems: 'center',
  },

  form: {
    ...CommonStyles.card,
    marginTop: 16,
  },

  textInput: {
    ...CommonStyles.card,
    backgroundColor: '#fafaff',
    width: 300,
  },

  formButton: {
    ...CommonStyles.button,
    width: 300,
    alignItems: 'center',
  },
});