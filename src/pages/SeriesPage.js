import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import series from '../../series.json' 
import SerieCard from '../components/SerieCard'

const isEven = number => number % 2 === 0;


const SeriesPage = props  => (
    <View>
        <FlatList
            data={series}
            renderItem={({ item, index }) => ( 

                <SerieCard serie={item}
                            isFirstColumn={isEven(index)}/>
            )}
            keyExtractor={item => item.id}  
            numColumns={2}  />
    </View>
)

export default SeriesPage;