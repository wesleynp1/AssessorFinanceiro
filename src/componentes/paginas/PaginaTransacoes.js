import {useState} from "react";
import { View,Text, Button,FlatList, SafeAreaView,StyleSheet } from "react-native";
import {Picker} from '@react-native-picker/picker';

import Transacao from "../Transacao";
import { dateParaTexto } from "../CampoData.js";
import {inteiroParaReal} from "../CampoDinheiro"
import estatistica from "../../controladores/estatistica.js";
import { TextInput } from "react-native-gesture-handler";

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

    const filtrarTransacao = (transacoes,texto)=>{

        let tratarTexto = (t) => {        
            return t.toLowerCase() //NÃO É CASE-SENSITIVE
                    .replace("á","a")//NÃO DIFERE ACENTO AGUDO 
                    .replace("é","e")
                    .replace("í","i")
                    .replace("ó","o")
                    .replace("ú","u")
                    .replace("â","a")//NÃO DIFERE ACENTO circunflexo
                    .replace("ê","e")
                    .replace("ô","o")
                    ;
                }
    
        if(texto=="")return transacoes;

        return transacoes.filter(transacao => 
            {
                return(
                    tratarTexto(transacao.categoria).includes(tratarTexto(texto)) ||
                    dateParaTexto(transacao.data).includes(tratarTexto(texto)) ||
                    tratarTexto(transacao.conta.toString()).includes(tratarTexto(texto)) || 
                    transacao.valor.toString().includes(tratarTexto(texto))
                );
            });
    }

const PaginaTransacoes = ({
    ano,
    selecionarAno,
    irParaPaginaNovaTransacao, 
    irParaPaginaEditarTransacao, 
    transacoes, 
    excluirTransacao})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado,setAnoSelecionado] = useState(ano);
    const [filtro,setFiltro] = useState("");

    let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);   
    let transacoesDoMesFiltrado = filtrarTransacao(transacoesDoMes,filtro);
    
    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item    
                                     label={mesesDoAno[i]}
                                        value={i} 
                                        key={i}/>)
    }


    let receita = inteiroParaReal(estatistica.getReceita(transacoesDoMes));
    let despesa = inteiroParaReal(estatistica.getDespesa(transacoesDoMes));

    let numeroBalaco = estatistica.getBalanco(transacoesDoMes)
    let balanco_E_negativo = numeroBalaco<0    
    let balanco = inteiroParaReal(numeroBalaco)
    if(balanco_E_negativo)balanco = balanco.replace("R$ ","R$ -");
        

    return(
        <View style={{flex:1,backgroundColor:"#292616"}}>
            <View style={{flex:3}}>
                <Text style={estilo.Titulo}>Assistente Financeiro</Text>
                <Text style={{color:'white',textAlign:'center'}}>HOJE: {dateParaTexto(new Date())}</Text>

                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Picker 
                        onValueChange={m =>{setMesSelecionado(m)}}
                        selectedValue={mesSelecionado}
                        style={{width:180,backgroundColor:'#808000',}}>
                        {pickersMes}
                    </Picker>

                    <TextInput 
                        value={anoSelecionado.toString()} 
                        placeholder={anoSelecionado.toString()}
                        style={{width:64,textAlign:"center",backgroundColor:'#909000'}}
                        onChangeText={setAnoSelecionado}
                        onSubmitEditing={()=>selecionarAno(parseInt(anoSelecionado))}
                        />
                </View>

                <View style={{ display:"flex", flexDirection: "row"}}>
                    <Text style={{flex:1,color:'#007700',textAlign:'center'}}>RECEITA: {"\n"+receita}</Text>
                    <Text style={{flex:1, color:'#d66554',textAlign:'center'}}>DESPESA: {"\n"+despesa}</Text>
                    <Text style={{flex:1, color:(balanco_E_negativo ? "#FF0000" : '#96c3d9'),textAlign:'center'}}>BALANÇO: {"\n"+balanco}</Text>
                </View>
                
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

            <TextInput  style={{backgroundColor:"#221122", margin:4,backgroundColor: "white"}}
                                placeholderTextColor="black" 
                                placeholder="Digite uma informacao para filtrar" 
                                onChangeText={t=>{setFiltro(t)}}/>
                
                <SafeAreaView style={{flex:4, backgroundColor:"#221122",margin:4}}>
                        <FlatList
                            data={transacoesDoMesFiltrado}
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
        color:"white",
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
        backgroundColor: "#292616",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },
});

export default PaginaTransacoes