import {useState} from "react";
import { View,Text, Button,FlatList, SafeAreaView, StyleSheet, SectionList } from "react-native";
import {Picker} from '@react-native-picker/picker';

import Transacao from "../Transacao";
import {SeletorMesAno}  from "../SeletorMesAno.js";
import { dateParaTexto } from "../CampoData.js";
import {inteiroParaReal} from "../CampoDinheiro"
import estatistica from "../../controladores/estatistica.js";
import { TextInput } from "react-native-gesture-handler";



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

        let transacoesFiltradas = transacoes.filter((transacao) => 
            {
                /*console.log(inteiroParaReal(transacao.valor));
                console.log(tratarTexto(texto));
                console.log(inteiroParaReal(transacao.valor).includes(tratarTexto(texto)));*/
                
                let resultado = tratarTexto(transacao.categoria).includes(tratarTexto(texto)) ||
                    dateParaTexto(transacao.data).includes(tratarTexto(texto)) ||
                    tratarTexto(transacao.conta.toString()).includes(tratarTexto(texto)) || 
                    inteiroParaReal(transacao.valor).includes(tratarTexto(texto));

                    //.log('resultado:'+resultado);

                return resultado;
            });

            //console.log(transacoesFiltradas);

            return transacoesFiltradas;
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

    //SELECIONA AS TRANSAÇÕES DO MÊS
    let transacoesDoMes = transacoes;
    if(mesSelecionado!=13){
        let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);   
    }

    //FILTRA TRANSAÇÕES
    let transacoesDoMesFiltrado = filtrarTransacao(transacoesDoMes,filtro)

    

    //CATEGORIZA TRANSAÇÕES
    SecaoDia = {title: "", data: ""};
    transacoesCategorizadas = [];
    transacoesDoMesFiltrado.forEach(t => {
        let dataTransacao = dateParaTexto(t.data);
        
        if(dataTransacao!=SecaoDia.title){
            SecaoDia = {title: dataTransacao, data: [t]};
            if(SecaoDia.title!="")transacoesCategorizadas.push(SecaoDia);     
        }else{
            SecaoDia.data.push(t);
        }
    });   
    

    //CALCULA RECEITA DESPESA E BALANÇO
    let receita = inteiroParaReal(estatistica.getReceita(transacoesDoMes));
    let despesa = inteiroParaReal(estatistica.getDespesa(transacoesDoMes));

    let numeroBalaco = estatistica.getBalanco(transacoesDoMes)
    let balanco_E_negativo = numeroBalaco<0    
    let balanco = inteiroParaReal(numeroBalaco)
    if(balanco_E_negativo)balanco = balanco.replace("R$ ","R$ -");
        
    
    return(
        <View style={{flex:1,backgroundColor:"#292616"}}>
            <View>
                <Text style={estilo.Titulo}>Assistente Financeiro</Text>
                
                <SeletorMesAno 
                    aoMudarMes={m =>{setMesSelecionado(m)}}
                    aoMudarAno={setAnoSelecionado}
                    aoConfirmarAno={()=>selecionarAno(parseInt(anoSelecionado))}
                    mesSelecionado={mesSelecionado} 
                    anoSelecionado={anoSelecionado}/>                

                <View style={{ display:"flex", flexDirection: "row"}}>
                    <Text style={{flex:1,color:'#007700',textAlign:'center'}}>RECEITA: {"\n"+receita}</Text>
                    <Text style={{flex:1, color:'#d66554',textAlign:'center'}}>DESPESA: {"\n"+despesa}</Text>
                    <Text style={{flex:1, color:(balanco_E_negativo ? "#AA0000" : '#96c3d9'),textAlign:'center'}}>BALANÇO: {"\n"+balanco}</Text>
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

            <View>
                <TextInput  
                    style={{backgroundColor:"#221122", backgroundColor: "black"}}       placeholderTextColor="white" 
                    placeholder="Digite uma informacao para filtrar"  
                    onChangeText={t=>{setFiltro(t)}}/>
            </View>
                
            <SafeAreaView style={{flex:1,backgroundColor:"#221122"}}>
                <Text style={estilo.Subtitulo}>Transacoes</Text>
                    <SectionList                            
                        sections={transacoesCategorizadas}
                        renderSectionHeader={({section: {title}}) => (
                            <Text style={{fontSize:15,textAlign:'center',marginTop:16}}>{title}</Text>
                        )}

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
    Subtitulo:{
        fontSize: 16,
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