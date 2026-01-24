import { useState } from "react";
import { View, Text, Button, SafeAreaView, StyleSheet, SectionList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

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


    //Divide as transações em seções por dia
    function categorizaTransacoes() {
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

    //FILTRA AS TRANSAÇÕES DO MÊS
    {
        if (mesSelecionado != 13) {//ANUAL
            transacoes = transacoes.filter(t => t.data.getMonth() == mesSelecionado);
        } else {
            transacoes = transacoes;
        }
    }

    //Filtra conforme busca do usuário
    if (filtro) {
        transacoes = filtrarTransacao(transacoes, filtro);
    }  
    
    //CALCULA RECEITA DESPESA E BALANÇO
    let receita = inteiroParaReal(estatistica.getReceita(transacoes));
    let despesa = inteiroParaReal(estatistica.getDespesa(transacoes));

    let numeroBalaco = estatistica.getBalanco(transacoes)
    let balanco_E_negativo = numeroBalaco < 0
    let balanco = inteiroParaReal(numeroBalaco)
    if (balanco_E_negativo) balanco = balanco.replace("R$ ", "R$ -");


    return (
        <View style={{ flex: 1, backgroundColor: "#292616" }}>
            <View>
                <Text style={estilo.Titulo}>Assistente Financeiro</Text>

                <SeletorMesAno
                    aoMudarMes={m => { setMesSelecionado(m) }}
                    aoMudarAno={setAnoSelecionado}
                    aoConfirmarAno={() => selecionarAno(parseInt(anoSelecionado))}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado} />

                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ flex: 1, color: '#007700', textAlign: 'center' }}>RECEITA: {"\n" + receita}</Text>
                    <Text style={{ flex: 1, color: '#d66554', textAlign: 'center' }}>DESPESA: {"\n" + despesa}</Text>
                    <Text style={{ flex: 1, color: (balanco_E_negativo ? "#AA0000" : '#96c3d9'), textAlign: 'center' }}>BALANÇO: {"\n" + balanco}</Text>
                </View>

                <Button
                    title={"registrar nova receita"}
                    color={"green"}
                    onPress={() => navegador.navigate("PaginaNovaTransacao", { eDespesa: false })}
                />

                <Button
                    color={"red"}
                    onPress={() => navegador.navigate("PaginaNovaTransacao", { eDespesa: true })}
                    title={"registrar nova despesa"}
                />
            </View>

            <View>
                <TextInput
                    style={{ backgroundColor: "#221122", backgroundColor: "black" }} placeholderTextColor="white"
                    placeholder="Digite uma informacao para filtrar"
                    onChangeText={t => { setFiltro(t) }} />
            </View>

            <SafeAreaView style={{ flex: 1, backgroundColor: "#221122" }}>
                <Text style={estilo.Subtitulo}>Transacoes</Text>
                <SectionList
                    sections={categorizaTransacoes()}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 16 }}>{title}</Text>
                    )}

                    renderItem={({ item }) => (
                        <Transacao
                            excluirTransacao={excluirTransacao}
                            transacao={item} />)}
                />
            </SafeAreaView>
        </View>
    );
}

let estilo = StyleSheet.create({
    Pagina: {
        padding: 16
    },
    Titulo: {
        fontSize: 24,
        color: "white",
        textAlign: 'center'
    },
    Subtitulo: {
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
});

export default PaginaTransacoes