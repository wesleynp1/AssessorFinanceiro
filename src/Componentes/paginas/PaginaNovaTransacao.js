import { View,Text, Button } from "react-native";
import firestore from '@react-native-firebase/firestore';

const PaginaNovaTransacao = ({novaTransacao})=>{
    let t = {   categoria:"lanche",
                conta: firestore().doc("usuarios/wesleynp/contas/carteira"),
                data:new Date(2022,0,3),
                valor:-30};

    

    return(
        <View>
            <Text>em construção...</Text>
            <Button onPress={()=>{novaTransacao(t);}} title={"testar add transacao"}/>

        </View>
    );
}

export default PaginaNovaTransacao