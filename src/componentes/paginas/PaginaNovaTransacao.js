import React from 'react';
import { View,Text, Alert} from "react-native";
import FormularioTransacao from "../FormularioTransacao";
import { inteiroParaReal } from "../CampoDinheiro";

const PaginaNovaTransacao = ({registrarNovaTransacao, nomeContas, eDespesa, categorias, ultimaContaUtilizada})=>{
    const transacaoInicial = {categoria:categorias[0],
                            conta: ultimaContaUtilizada,
                            data: new Date(),
                            valor:0}

    console.log(ultimaContaUtilizada)

    const ConfirmarRegistrarTransacao = (tr)=>{
            Alert.alert(
                "Adicionar Transação",
                "Registrar a " + (eDespesa ? "despesa" : "receita") + 
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
                        onPress: ()=> registrarNovaTransacao(tr)
                    }
                ]
                );
        }
    

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA NOVA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <FormularioTransacao    
            transacaoInicial={transacaoInicial} 
            contas={nomeContas}
            eDespesa={eDespesa}
            aoSubmeter={tr=>{ConfirmarRegistrarTransacao(tr)}}
            categorias={categorias}/>
        </View>
    );
}

export default PaginaNovaTransacao