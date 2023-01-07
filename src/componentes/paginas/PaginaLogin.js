import { useState } from 'react';
import { View, TextInput, Button, } from 'react-native';
import auth from '@react-native-firebase/auth';


const PaginaLogin = ({onLogin})=>{
    const [carregando, setCarregando] = useState(false);
    const [senha, setSenha] = useState(false);

    let logar = ()=>{
        if(senha==""){alert("digite a senha");return;}

        setCarregando(true);

        auth().signInWithEmailAndPassword("wesleynp@google.com",senha)
        .then(u => {onLogin({conta:u.user})})
        .catch(e =>{alert("Erro no login:"+e);setCarregando(false)})
    }

    return(
    <View style={{flex:1,justifyContent:"center", alignItems:"center"}}>
      <TextInput 
        style={{color: "white",backgroundColor:"black", width: 256, textAlign:'center'}}  
        onChangeText={t=>{setSenha(t)}}
        placeholder="SENHA"
        secureTextEntry={true}
        autoCapitalize={"none"}
        onSubmitEditing={logar}
        editable={!carregando}
      />

      <Button 
        title='logar'
        onPress={logar}
        disabled={carregando}
      />
    </View>
    )
}

export default PaginaLogin;