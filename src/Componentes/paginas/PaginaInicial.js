import react, {Component} from "react";
import { View,Text, Button,FlatList, SafeAreaView } from "react-native";
import Transacao from "../Transacao";
import { dateParaTexto } from "../CampoData.js";


const PaginaInicial = ({irParaPaginaNovaTransacao, irParaPaginaEditarTransacao, saldoTotal, transacoes, contas, excluirTransacao})=>{

    var d = new Date();
    const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    return(
        <View style={{flex:1,backgroundColor:"#AAAA00"}}>
            <View style={{flex:3}}>
                <Text style={{color:'black',textAlign:'center'}}>Hello Assistente Financeiro</Text>
                <Text style={{color:'black',textAlign:'center'}}>data de hoje: {dateParaTexto(new Date())}</Text>
                <Text style={{color:'black',textAlign:'center'}}>MÊS SELECIONADO: {mesesDoAno[d.getMonth()]}</Text>
                <Text style={{color:'black',textAlign:'center',fontWeight:'bold'}}>SALDO ATUAL: R$ {saldoTotal}</Text>
                <Text style={{color:'black',textAlign:'center'}}>Contas: {contas.join(", ")}</Text>
                
                <Text style={{color:'#007700',textAlign:'center'}}>RECEITA DO MÊS: R$ XXX,XX</Text>
                <Text style={{color:'#770000',textAlign:'center'}}>DESPESA DO MÊS: R$ XXX,XX</Text>
                <Text style={{color:'#000077',textAlign:'center'}}>BALANÇO DO MÊS: R$ XXX,XX</Text>

                <Text style={{color:'#000077',textAlign:'center'}}>NÚMERO DE TRANSAÇÕES: {transacoes.length}</Text>
                
                <Button onPress={()=>irParaPaginaNovaTransacao(false)} color="green" title={"registrar nova receita"}/> 
                <Button onPress={()=>irParaPaginaNovaTransacao(true)} color="red"  title={"registrar nova despesa"}/>                            
            </View>

            
                <SafeAreaView style={{flex:4, backgroundColor:"#221122",margin:4}}>
                        <FlatList
                            data={transacoes}
                            renderItem={({item})=>(<Transacao excluirTransacao={excluirTransacao} editarTransacao={irParaPaginaEditarTransacao} transacao={item}/>)}
                            />
                </SafeAreaView>
        </View>
    );
}

export default PaginaInicial