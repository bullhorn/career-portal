import { Component, OnInit } from '@angular/core';
import { NovoModalRef, NovoModalParams } from 'novo-elements';

@Component({
  selector: 'error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {

  constructor(public params: NovoModalParams, private modalRef: NovoModalRef) { }

  public ngOnInit(): any {
  }

  public close(): void {
    this.modalRef.close();
  }

}
