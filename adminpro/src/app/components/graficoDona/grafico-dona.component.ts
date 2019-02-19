import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {
  @Input() grafico: {labels: string[], data: number[], type: string, leyenda: string };

  constructor() { }

  ngOnInit() {
  }

}
