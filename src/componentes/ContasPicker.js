import React from "react";
import { Text,View,StyleSheet} from "react-native";
import {Picker} from '@react-native-picker/picker';

function ContasPicker({contas, onValueChange, contaSelecionada, corPadrao="blue",corFonte="white"}){

    const estilo = StyleSheet.create({
        selecionador:{
            backgroundColor:corPadrao,
            color:corFonte,
            textAlign:"center"
        },
        rotulos:{
            fontSize: 12,
            color:corPadrao,
        },
        campos:{
            fontSize: 12,
            color:"black",
            textAlign:"center",
            borderColor:corPadrao,
            borderStyle:"solid",
            borderWidth:2,
            margin:10,
            padding: 2
        }
    });

    let pickersContas = []
    for(let i=0; i<contas.length;i++)
    {
        pickersContas.push(<Picker.Item style={estilo.selecionador} 
                                        label={contas[i]} 
                                        value={contas[i]} 
                                        key={i}/>)
    }

    return(
    <View style={estilo.campos}>
        <Text style={estilo.rotulos}>conta</Text>
        <Picker dropdownIconColor={corPadrao}
                selectedValue={contaSelecionada}
                onValueChange={onValueChange}>            
            {pickersContas}            
        </Picker>
    </View>
    );
}

export default ContasPicker;