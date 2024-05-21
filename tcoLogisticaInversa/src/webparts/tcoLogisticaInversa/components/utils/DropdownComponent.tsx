/* eslint-disable prefer-const */

/* eslint-disable no-new */

/* eslint-disable no-void */

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
//import { SPFx, spfi } from '@pnp/sp';

import {Web} from 'sp-pnp-js';

export interface IDropdownComponentProps {
  listName: string;
  fieldName?: string;
  onChange: any;
  context?:any;
  rol?:any;
  fieldSearch?: string;
}

export interface IDropdownComponentState {
  options: IDropdownOption[];
  selectedOption?: IDropdownOption;
}

export class DropdownComponent extends React.Component<IDropdownComponentProps, IDropdownComponentState> {
  
  public web: Web;

  constructor(props: IDropdownComponentProps) {
    super(props);

    this.web = new Web(this.props.context.pageContext.web.absoluteUrl);

    this.state = {
      options: [],
      selectedOption: undefined
    };
  }

  componentDidMount(){
    this.loadOptions();
  }

  private async loadOptions(): Promise<void> {
    try {
      //const sp = spfi().using(SPFx(this.props.context));
      const list =this.web.lists.getByTitle(this.props.listName);

      const items = await list.items.select('Id', this.props.fieldSearch).getAll();
      const options: IDropdownOption[] = items.map((item:any) => ({
        key: item.Id,
        text: item[this.props.fieldSearch]
      }));

      this.setState({
        options: options
      });
    } catch (error) {
      console.log('Error loading options:', error);
    }
  }

  private handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    this.setState({
      selectedOption: option
    });
    this.props.onChange(option.key);
  };

  public render(): React.ReactElement<IDropdownComponentProps> {
    const  options = this.state.options;

    return (
      <div>
        <Dropdown
          label={this.props.fieldName}
          options={options}
          defaultSelectedKey={this.props.rol}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
