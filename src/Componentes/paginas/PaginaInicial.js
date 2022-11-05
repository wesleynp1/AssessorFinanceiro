import react, {Component} from "react";
import { View,Text, Button,FlatList, SafeAreaView } from "react-native";
import Transacao from "../Transacao";


const PaginaInicial = ({saldoTotal, irParaPaginaNovaTransacao, transacoes})=>{

    
    var d = new Date();
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]


    return(
        <View style={{flex:1,backgroundColor:"#AAAA00"}}>
            <View style={{flex:2}}>
                <Text style={{color:'black',textAlign:'center'}}>Hello Assistente Financeiro</Text>
                <Text style={{color:'black',textAlign:'center'}}>data de hoje: {("0"+d.getDate()).slice(-2)+"/"+(d.getMonth()+1)+"/"+d.getFullYear()}</Text>
                <Text style={{color:'black',textAlign:'center'}}>MÊS SELECIONADO: {meses[d.getMonth()]}</Text>
                <Text style={{color:'black',textAlign:'center',fontWeight:'bold'}}>SALDO ATUAL: R$ {saldoTotal}</Text>
                
                <Text style={{color:'#007700',textAlign:'center'}}>RECEITA DO MÊS: R$ XXX,XX</Text>
                <Text style={{color:'#770000',textAlign:'center'}}>DESPESA DO MÊS: R$ XXX,XX</Text>
                <Text style={{color:'#000077',textAlign:'center'}}>BALANÇO DO MÊS: R$ XXX,XX</Text>

                <Button onPress={()=>irParaPaginaNovaTransacao()} title={"registrar nova transação"}/>
            </View>

            
                <SafeAreaView style={{flex:5, backgroundColor:"#221122",margin:4}}>
                        <FlatList
                            data={transacoes}
                            renderItem={({item})=>(
                                <Transacao  t={item} 
                                            categoria={item.categoria}                                    
                                            conta={item.conta}
                                            data={item.data}
                                            valor={item.valor}
                                            />
                                )}/>
                </SafeAreaView>
        </View>
    );
}

export default PaginaInicial