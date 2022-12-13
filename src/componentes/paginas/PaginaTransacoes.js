import {useState} from "react";
import { View,Text, Button,FlatList, SafeAreaView,StyleSheet } from "react-native";
import {Picker} from '@react-native-picker/picker';

import Transacao from "../Transacao";
import { dateParaTexto } from "../CampoData.js";
import {inteiroParaReal} from "../CampoDinheiro"
import estatistica from "../../controladores/estatistica.js";

const mesesDoAno = [
    "Janeiro", 
    "Fevereiro", 
    "Março", 
    "Abril", 
    "Maio", 
    "Junho", 
    "Julho", 
    "Agosto", 
    "Setembro", 
    "Outubro", 
    "Novembro", 
    "Dezembro"]

const PaginaTransacoes = ({irParaPaginaNovaTransacao, irParaPaginaEditarTransacao, transacoes, contas, excluirTransacao})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth());

    let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);    
    
    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item    
                                     label={mesesDoAno[i]}
                                        value={i} 
                                        key={i}/>)
    }


    let receita = inteiroParaReal(estatistica.getReceita(transacoesDoMes));
    let despesa = inteiroParaReal(estatistica.getDespesa(transacoesDoMes));
    let balanco = inteiroParaReal(estatistica.getBalanco(transacoesDoMes));
    let balancoNegativo = (estatistica.getBalanco(transacoesDoMes)<0);
    if(balancoNegativo)balanco = balanco.replace("R$ ","R$ -");

    return(
        <View style={{flex:1,backgroundColor:"#AAAA00"}}>
            <View style={{flex:3}}>
                <Text style={estilo.Titulo}>Assistente Financeiro</Text>
                <Text style={{color:'black',textAlign:'center'}}>HOJE: {dateParaTexto(new Date())}</Text>
                
                <Text style={{color:'black',textAlign:'center'}}>MÊS SELECIONADO: </Text>

                <Picker 
                    onValueChange={m =>{setMesSelecionado(m)}}
                    selectedValue={mesSelecionado}
                    style={{width:180,alignSelf:"center",backgroundColor:'#808000'}}>
                    {pickersMes}
                </Picker>
                
                <Text style={{color:'#007700',textAlign:'center'}}>RECEITA DO MÊS: {receita}</Text>
                <Text style={{color:'#770000',textAlign:'center'}}>DESPESA DO MÊS: {despesa}</Text>
                <Text style={{color:(balancoNegativo ? "#FF0000" : '#000077'),textAlign:'center'}}>BALANÇO DO MÊS: {balanco}</Text>
                
                <Button 
                    title={"registrar nova receita"}
                    color={"green"}
                    onPress={()=>irParaPaginaNovaTransacao(false)} 
                     /> 

                <Button 
                    color={"red"}
                    onPress={()=>irParaPaginaNovaTransacao(true)}   
                    title={"registrar nova despesa"}
                    />
            </View>

            
                <SafeAreaView style={{flex:4, backgroundColor:"#221122",margin:4}}>
                        <FlatList
                            data={transacoesDoMes}
                            renderItem={({item})=>(
                                <Transacao 
                                excluirTransacao={excluirTransacao} 
                                editarTransacao={irParaPaginaEditarTransacao} 
                                transacao={item}/>)}
                            />
                </SafeAreaView>
        </View>
    );
}

let estilo = StyleSheet.create({
    Pagina:{
        padding: 16
    },
    Titulo:{
        fontSize: 24,
        color:"black",
        textAlign:'center'
    },  
    Texto:{
        fontSize: 15,
        color:"black",
        textAlign:'center'
    },
    Quadro: {  
        flex:1,
        margin:5,
        backgroundColor: "#AAAACC",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },
});

export default PaginaTransacoes