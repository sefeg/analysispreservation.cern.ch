import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  List,
  ListItem,
} from 'grommet';


import FormLayer from '../components/FormLayer';
import ItemBrief from '../components/ItemBrief';

import FormTrashIcon from 'grommet/components/icons/base/FormTrash';
import FormUpIcon from 'grommet/components/icons/base/FormUp';
import FormDownIcon from 'grommet/components/icons/base/FormDown';

class ArrayFieldTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layers: []
    };
  }

  _onAddClick(event) {
    this.setState({ layers: this.state.layers.concat([true])});
    this.props.onAddClick(event);
  }

  _onFormLayerClose(index) {
    const layers = this.state.layers;
    layers[index] = false;
    this.setState({ layers: layers});
  }

  _showLayer(index) {
    const layers = this.state.layers;
    layers[index] = true;
    this.setState({ layers: layers});
  }

  render() {
    return (
        <Box flex={false} size={{"height": {"max": "small"} }}>
          <List selectable={false}>
            { this.props.items.length > 0 ?
              this.props.items.map(element => (
                <ListItem key={element.index} onClick={this._showLayer.bind(this, element.index)} separator="none" flex={true} margin="none" pad="none" justify="between">
                  <FormLayer
                    layerActive={this.state.layers[element.index]}
                    onClose={this._onFormLayerClose.bind(this, element.index)}
                    properties={element.children}
                    remove={element.hasRemove ? element.onDropIndexClick(element.index) : null}
                  />
                  <Box flex={true} direction="row" wrap={false}>
                    <Box flex={true} pad="small">
                      <ItemBrief index={element.index} item={element.children.props.formData} label={this.props.uiSchema.label || (this.props.title || "Item")} />
                    </Box>
                    <Box direction="row" justify="between">
                      <Button
                        onClick={element.hasRemove ? element.onDropIndexClick(element.index) : null}
                        icon={<FormTrashIcon />} />
                        {
                          this.props.reorder ?
                          [
                            <Button
                              key="down"
                              onClick={element.hasMoveDown ? element.onReorderClick(element.index, element.index+1) : null}
                              icon={<FormDownIcon margin="none" pad="none" />} />,
                            <Button
                              key="up"
                              onClick={element.hasMoveUp ? element.onReorderClick(element.index, element.index-1) : null}
                              icon={<FormUpIcon margin="none" pad="none" />} />
                          ] : null
                        }
                    </Box>
                  </Box>
                </ListItem>
              )) :
              null
              // <ListPlaceholder
              //   addControl={<Button onClick={this.props._onAddClick.bind(this)} icon={<AddIcon />} />}
              //   emptyMessage='You do not have any items at the moment.'
              //   unfilteredTotal={0}/>
            }
          </List>
        </Box>
    );
  }
}

ArrayFieldTemplate.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  items: PropTypes.array,
  properties: PropTypes.object,
  onAddClick: PropTypes.func
};

export default ArrayFieldTemplate;