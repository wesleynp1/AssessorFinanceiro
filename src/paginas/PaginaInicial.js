import react, {Component} from "react";
import { View,Text } from "react-native";

const PaginaInicial = ({saldoTotal})=>{

    return(
        <View>

            <Text style={{color:'black',textAlign:'center'}}>Hello Assistente Financeiro</Text>
            <Text style={{color:'black',textAlign:'center'}}>MÊS SELECIONADO: ???</Text>
            <Text style={{color:'black',textAlign:'center',fontWeight:'bold'}}>SALDO ATUAL: R$ {saldoTotal}</Text>
            <Text style={{color:'#007700',textAlign:'center'}}>RECEITA DO MÊS: R$ XXX,XX</Text>
            <Text style={{color:'#770000',textAlign:'center'}}>DESPESA DO MÊS: R$ XXX,XX</Text>
            <Text style={{color:'#000077',textAlign:'center'}}>BALANÇO DO MÊS: R$ XXX,XX</Text>
        </View>
    );
}

export default PaginaInicial