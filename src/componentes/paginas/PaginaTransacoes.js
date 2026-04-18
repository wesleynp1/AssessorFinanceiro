import React from 'react';
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SectionList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

//COMPONENTES PRÓPRIOS
import { SeletorMesAno } from "../SeletorMesAno.js";
import { dateParaTexto } from "../CampoData.js";
import { inteiroParaReal } from "../CampoDinheiro"
import Transacao from "../Transacao";

//CONTROLADORES
import estatistica from "../../controladores/estatistica.js";
import filtrarTransacao from "../../controladores/filtroTransacoes.js";

function PaginaTransacoes({ ano, selecionarAno, transacoes, excluirTransacao }) {

    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(ano);
    const [filtro, setFiltro] = useState("");
    const navegador = useNavigation();

    //FILTRA AS TRANSAÇÕES DO MÊS    
    if (mesSelecionado != 13) {//ANUAL
        transacoes = transacoes.filter(t => t.data.getMonth() == mesSelecionado);
    }    

    //Filtra conforme busca do usuário
    if (filtro) {
        transacoes = filtrarTransacao(transacoes, filtro);
    }
    
    //CALCULA RECEITA DESPESA E BALANÇO
    let numeroBalaco = estatistica.getBalanco(transacoes);
    let balancoNegativo = numeroBalaco < 0;

    const estilo = StyleSheet.create({
        Pagina: {
            flex: 1, 
            backgroundColor: "#292616"
        },
        Titulo: {
            fontSize: 24,
            color: "white",
            textAlign: 'center'
        },
        Receita:{ 
            flex: 1, 
            textAlign: 'center', 
            color: '#007700' 
        },
        Despesa:{ 
            flex: 1, 
            textAlign: 'center', 
            color: '#d66554' 
        },
        Balanco:{ 
            flex: 1, 
            textAlign: 'center',
            color: (balancoNegativo ? "#AA0000" : '#96c3d9')
        },
        ContainerBotoes:{
            display: "flex",
            flexDirection:"row",        
            backgroundColor:"yellow",
            marginTop:4,
            marginBottom:4,
        },
        BotaoReceita:{
            flex:1,        
            alignItems:"center",
            padding: 12,
            backgroundColor:"#064d06"
        },
        BotaoDespesa:{
            flex:1,        
            alignItems:"center",
            padding: 12,
            backgroundColor:"#6b1610"
        },
        TextBotoes:{
            fontSize:16
        },
        BarraPesquisa:{
            backgroundColor: "#221122", 
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1
        }
    })
        
    return (
        <View style={estilo.Pagina}>
            <View>
                <Text style={estilo.Titulo}>Assistente Financeiro</Text>

                <SeletorMesAno
                    aoMudarMes={m => { setMesSelecionado(m) }}
                    aoMudarAno={setAnoSelecionado}
                    aoConfirmarAno={() => selecionarAno(parseInt(anoSelecionado))}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado} />

                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={estilo.Receita}>RECEITA: {"\n" + inteiroParaReal(estatistica.getReceita(transacoes))}</Text>
                    <Text style={estilo.Despesa}>DESPESA: {"\n" + inteiroParaReal(estatistica.getDespesa(transacoes))}</Text>
                    <Text style={estilo.Balanco}>BALANÇO: {"\n" + inteiroParaReal(numeroBalaco)}</Text>
                </View>

                <View style={estilo.ContainerBotoes}>                    
                    <TouchableOpacity         
                        style={estilo.BotaoReceita}       
                        onPress={() => navegador.navigate("PaginaNovaTransacao", { eDespesa: false })}
                    >
                        <Text style={estilo.TextBotoes}>Nova Receita</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity                   
                        style={estilo.BotaoDespesa}    
                        onPress={() => navegador.navigate("PaginaNovaTransacao", { eDespesa: true })}
                        title={"nova despesa"}
                    >
                        <Text style={estilo.TextBotoes}>Nova Despesa</Text>
                    </TouchableOpacity>                    
                </View>
            </View>

            {/* BARRA DE PESQUISA */}
            <View>
                <TextInput
                    style={estilo.BarraPesquisa} placeholderTextColor="white"
                    placeholder="Digite uma informacao para filtrar"
                    onChangeText={t => { setFiltro(t) }} />
            </View>     

            <AreaTransacoes transacoes={transacoes} excluirTransacao={excluirTransacao} />

        </View>
    );
}


export function AreaTransacoes({transacoes,excluirTransacao, titulo="Transações", editarTransacao, alteraveis=true}){
    //ESTILO
    const estilo = StyleSheet.create({
        Titulo: {
            fontSize: 16,
            color: "white",
            textAlign: 'center'
        },
        Texto: {
            fontSize: 15,
            color: "black",
            textAlign: 'center'
        },
        Quadro: {
            flex: 1,
            margin: 5,
            backgroundColor: "#292616",
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 2,
        },
        DataSecao: {
            fontSize: 15, 
            textAlign: 'center', 
            marginTop: 16 
        },
        AreaTransacoes:{
            flex: 1, 
            backgroundColor: "#221122" 
        },
        
    });

    return(
        <SafeAreaView style={estilo.AreaTransacoes}>
            <Text style={estilo.Titulo}>{titulo}</Text>
            <SectionList
                sections={categorizaTransacoes(transacoes)}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={estilo.DataSecao}>{title}</Text>
                )}

                renderItem={({ item }) => (
                    <Transacao
                        excluirTransacao={excluirTransacao}
                        transacao={item} 
                        editarTransacao={editarTransacao}
                        alteravel={alteraveis}
                        />)}
            />
        </SafeAreaView>
    );
}

//Divide as transações em seções por dia
export function categorizaTransacoes(transacoes) {
    let SecaoDia = { title: "", data: "" };
    let transacoesCategorizadas = [];
    transacoes.forEach(t => {
        let dataTransacao = dateParaTexto(t.data);

        if (dataTransacao != SecaoDia.title) {
            SecaoDia = { title: dataTransacao, data: [t] };
            if (SecaoDia.title != "") transacoesCategorizadas.push(SecaoDia);
        } else {
            SecaoDia.data.push(t);
        }
    });

    return transacoesCategorizadas;
}


export default PaginaTransacoes