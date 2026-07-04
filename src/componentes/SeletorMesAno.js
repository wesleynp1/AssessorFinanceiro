import React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';

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

    //PREPARA O PICKER MESES
export const SeletorMesAno = ({aoMudarMes,aoMudarAno,mesSelecionado,anoSelecionado,aoConfirmarAno})=>{

    let pickersMes = [];
    
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item    
                                     label={mesesDoAno[i]}
                                        value={i} 
                                        key={i}/>)
    }

    pickersMes.push(<Picker.Item    
                    label={"ANUAL"}
                    value={12} 
                    key={12}/>);

    function avancarMes(){
        if(mesSelecionado <= 11){
            aoMudarMes(mesSelecionado+1)
        }
    }

    function retrocederMes(){
        if(mesSelecionado >= 1){
            aoMudarMes(mesSelecionado-1)
        }
    }

    return (
        <View style={estilo.container}>
            <TouchableOpacity style={estilo.setaMes} onPress={retrocederMes}>
                <Text style={estilo.setaMesTexto}>←</Text>
            </TouchableOpacity>

            <Picker 
                onValueChange={aoMudarMes}
                selectedValue={mesSelecionado}
                style={estilo.mes}>
                {pickersMes}
            </Picker>
            
            <TouchableOpacity style={estilo.setaMes} onPress={avancarMes}>
                <Text style={estilo.setaMesTexto}>→</Text>
            </TouchableOpacity>

            <TextInput 
                value={anoSelecionado.toString()} 
                placeholder={anoSelecionado.toString()}
                style={estilo.ano}
                onChangeText={aoMudarAno}
                onSubmitEditing={aoConfirmarAno}
                />
        </View>
    );
}

const estilo = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'center'
    },
    ano:{
        width:64,
        textAlign:"center",
        backgroundColor:'#000000ff'
    },
    mes:{
        width:180,
        backgroundColor:'#424242ff'
    },
    setaMes:{
        borderColor:'white',
        borderWidth:2,
        borderStyle:"solid",
        margin:3,
        alignContent: "center",
        justifyContent: "center",        
    },
    setaMesTexto:{
        fontSize:20
    }
})