import { useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import conectorBancoDeDados from '../../controladores/conectorBancoDeDados';
import PaginaCarregando from "./PaginaCarregando";
import { dateParaTexto } from "../CampoData";

function PaginaLancamentos(){
    const [carregando,setCarregando] = useState(true);
    const [lancamentos,setLancamentos] = useState([]);

    if(carregando){

        conectorBancoDeDados
        .getLancamentos()
        .then( l => {
            setLancamentos(l);
            setCarregando(false);
        })
        .catch(()=>{Alert.alert("ERRO","Erro ao adicionar transacao")})

        return <PaginaCarregando/>;
    }else{
        return (
            <View style={estilo.principal}>
                <Text>Teste</Text>
                <Button 
                title="testar credito" 
                onPress={()=>{
                    conectorBancoDeDados.inserirLancamentos({categoria:"pagina",valor:299,data: new Date()})
                    .then(()=>{
                        setCarregando(true)
                        Alert.alert("Sucesso!","Lançamento realizado com sucesso!")
                    })
                    .catch((erro)=>{Alert.alert("ERRO","Erro ao adicionar lancamento: "+erro)})
                    }}/>

                    <Text>resultados: {lancamentos.length}</Text>

                    <FlatList
                        data={lancamentos}
                        renderItem={(lancamento) => <Lancamento id={lancamento.index} lancamento={lancamento.item}/>}
                    />
            </View>
        )  
    }    
}

function Lancamento({lancamento}){
    const estilo = StyleSheet.create({
        backgroundColor:"black",
        color:"white",
        marginBottom:10,
        padding:4
    });

    return (
        <View style={estilo}>            
            <Text>categoria:{lancamento.categoria}</Text>
            <Text>valor:{lancamento.valor}</Text>
            <Text>data:{dateParaTexto(lancamento.data)}</Text>            
        </View>
    )
}

const estilo = StyleSheet.create({
    principal:{
        backgroundColor: "#4d2e2eff",
        flex:1,
        justifyContent:"center", 
        alignItems:"center"}
});

export default PaginaLancamentos;