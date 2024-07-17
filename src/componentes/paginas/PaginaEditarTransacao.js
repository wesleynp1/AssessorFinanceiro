import { View,Text, Alert } from "react-native";
import FormularioTransacao from "../FormularioTransacao";
import {Picker} from '@react-native-picker/picker';
import { inteiroParaReal } from "../CampoDinheiro";
import { useState } from "react";

const PaginaEditarTransacao = ({atualizarTransacao,transacaoInicial, nomeContas})=>{
    const [eDespesa,seteDespesa] = useState(transacaoInicial.valor<0 ? true : false);

    const aoSubmenter = (t)=>{
        t.id = transacaoInicial.id;
        atualizarTransacao(t);
    }

    const ConfirmarEditarTransacao = (tr)=>{
        Alert.alert(
            "Salvar alterações na transação",
            "Registrar as alterações na " + (eDespesa ? "despesa" : "receita") + 
            " de "+ inteiroParaReal(tr.valor) + "(" + tr.conta + ")" +
            " em "+ 
            ("0"+tr.data.getDate()).slice(-2) + "/" + 
            ("0"+(tr.data.getMonth()+1)).slice(-2) +"/" +
            (tr.data.getFullYear()) +
            " da categoria " + tr.categoria + "?",
            [
                {
                    text:"Cancelar"
                },
                {
                    text:"Registrar",
                    onPress: ()=> aoSubmenter(tr)
                }
            ]
            );
    }

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <Picker 
                selectedValue={eDespesa}
                onValueChange={v=>{seteDespesa(v)}}
                dropdownIconColor="black"
                style={{color:"black",textAlign:"center"}}
                >
                
                <Picker.Item label="DESPESA" value={true}/>
                <Picker.Item label="RECEITA" value={false}/>
            </Picker>

            <FormularioTransacao    transacaoInicial={transacaoInicial} 
                                    contas={nomeContas}
                                    eDespesa={eDespesa}
                                    aoSubmeter={ConfirmarEditarTransacao}/>
        </View>
    );
}

export default PaginaEditarTransacao