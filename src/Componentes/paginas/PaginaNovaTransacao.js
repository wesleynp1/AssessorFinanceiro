import { View,Text, Button } from "react-native";
import firestore from '@react-native-firebase/firestore';
import FormularioTransacao from "../FormularioTransacao";

const PaginaNovaTransacao = ({novaTransacao})=>{
    let t = {   categoria:"mercado",
                conta: firestore().doc("usuarios/wesleynp/contas/carteira"),
                data:new Date(2022,0,3),
                valor:-30};

    let transacaoInicial = {categoria:"",
                            conta:"carteira",
                            data: new Date().toDateString(),
                            valor:0}
    

    return(
        <View>
            <Text>em construção...</Text>
            <Button onPress={()=>{novaTransacao(t);}} title={"testa add transacao"}/>

            <FormularioTransacao    transacaoInicial={transacaoInicial} 
                                    aoSubmeter={tr=>{novaTransacao(tr)}}/>
        </View>
    );
}

export default PaginaNovaTransacao