import { Component, OnInit } from '@angular/core';
import {
  NovoFormGroup,
  FormUtils,
  NovoModalRef,
  NovoModalParams,
  TextBoxControl,
  FileControl,
  PickerControl,
  SelectControl,
  NovoToastService,
  CheckboxControl,
  FieldInteractionApi,
} from 'novo-elements';
import { SettingsService } from '../services/settings/settings.service';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { ApplyService } from '../services/apply/apply.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-apply-modal',
  templateUrl: './apply-modal.component.html',
  styleUrls: ['./apply-modal.component.scss'],
})
export class ApplyModalComponent implements OnInit {

  public job: any;
  public source: string;
  public firstName: TextBoxControl;
  public lastName: TextBoxControl;
  public email: TextBoxControl;
  public phoneNumber: TextBoxControl;
  public form: NovoFormGroup;
  public genderRaceEthnicity: any;
  public veteran: any;
  public disability: any;
  public resume: FileControl;
  public loading: boolean = true;
  public hasError: boolean = false;
  public formControls: any[] = [];
  public eeocControls: any = [];
  public consentControl: any;
  public applying: boolean = false;
  public consentCheckbox: boolean = SettingsService.settings.privacyConsent.consentCheckbox;
  public showCategory: boolean  = SettingsService.settings.service.showCategory;
  public isIos: boolean = SettingsService.isIos;
  private APPLIED_JOBS_KEY: string = 'APPLIED_JOBS_KEY';

  constructor(private formUtils: FormUtils,
              public params: NovoModalParams,
              private modalRef: NovoModalRef,
              private applyService: ApplyService,
              private analytics: AnalyticsService,
              private toaster: NovoToastService,
              private router: Router,
              private translate: TranslateService,
               ) { this.toaster.parentViewContainer = this.params['viewContainer']; }

  public ngOnInit(): void {
    this.job = this.params['job'];
    this.source = this.params['source'];
    this.setupForm();
  }
  public setupForm(): void {
    this.firstName = new TextBoxControl({
      key: 'firstName',
      label: this.translate.instant('FIRST_NAME'),
      required: true,
      hidden: false,
      value: '',
    });
    this.lastName = new TextBoxControl({
      key: 'lastName',
      label: this.translate.instant('LAST_NAME'),
      required: true,
      hidden: false,
      value: '',
    });
    this.email = new TextBoxControl({
      key: 'email',
      label: this.translate.instant('EMAIL'),
      type: 'email',
      required: true,
      hidden: false,
      value: '',
    });
    this.phoneNumber = new TextBoxControl({
      key: 'phone',
      label: this.translate.instant('PHONE'),
      type: 'tel',
      required: false,
      hidden: false,
      value: '',
    });
    this.genderRaceEthnicity = [
      new SelectControl({
        key: 'gender',
        label: this.translate.instant('EEOC.GENDER_LABEL'),
        required: SettingsService.settings.eeoc.genderRaceEthnicity,
        hidden: false,
        options: [
          { value: 'M', label: this.translate.instant('EEOC.GENDER_MALE') },
          { value: 'F', label: this.translate.instant('EEOC.GENDER_FEMALE')},
          { value: 'D', label: this.translate.instant('EEOC.GENDER_ND')},
        ],
      }), new PickerControl({
        key: 'ethnicity',
        label: this.translate.instant('EEOC.RACE_ETHNICITY_LABEL'),
        required: SettingsService.settings.eeoc.genderRaceEthnicity,
        hidden: false,
        multiple: true,
        placeholder: this.translate.instant('EEOC.SELECT_ALL'),
        config: {
          options: [
            { value: 'HL', label: this.translate.instant('EEOC.RACE_ETHNICITY_HL') },
            { value: 'WH', label: this.translate.instant('EEOC.RACE_ETHNICITY_WH') },
            { value: 'BL', label: this.translate.instant('EEOC.RACE_ETHNICITY_BL') },
            { value: 'AS', label: this.translate.instant('EEOC.RACE_ETHNICITY_AS') },
            { value: 'NP', label: this.translate.instant('EEOC.RACE_ETHNICITY_NP') },
            { value: 'IA', label: this.translate.instant('EEOC.RACE_ETHNICITY_IA') },
            { value: 'DN', label: this.translate.instant('EEOC.RACE_ETHNICITY_DN') },
          ],
        },
      }),
    ];
    this.veteran = [
      new SelectControl({
        key: 'veteran',
        label: this.translate.instant('EEOC.VETERAN_LABEL'),
        description: this.translate.instant('EEOC.VETERAN_DESCRIPTION'),
        required: SettingsService.settings.eeoc.veteran,
        hidden: false,
        options: [
          { value: 'P', label: this.translate.instant('EEOC.VETERAN_P') },
          { value: 'V', label: this.translate.instant('EEOC.VETERAN_V')},
          { value: 'N', label: this.translate.instant('EEOC.VETERAN_N')},
          { value: 'D', label: this.translate.instant('EEOC.VETERAN_D')},
        ],
      }),
    ];
    this.disability = [
      new SelectControl({
        key: 'disability',
        label: this.translate.instant('EEOC.DISABILITY_LABEL'),
        description: this.translate.instant('EEOC.DISABILITY_DESCRIPTION'),
        required: SettingsService.settings.eeoc.disability,
        hidden: false,
        options: [
          { value: 'Y', label: this.translate.instant('EEOC.DISABILITY_Y') },
          { value: 'N', label: this.translate.instant('EEOC.DISABILITY_N')},
          { value: 'D', label: this.translate.instant('EEOC.DISABILITY_D')},
        ],
      }),
    ];
    this.resume = new FileControl({
      key: 'resume',
      required: true,
      hidden: false,
      description: `${this.translate.instant('ACCEPTED_RESUME')} ${SettingsService.settings.acceptedResumeTypes.toString()}`,
    });

    this.formControls = [this.firstName, this.lastName, this.email, this.phoneNumber, this.resume];

    let eeoc: any = SettingsService.settings.eeoc;
    for (let field in eeoc) {
      if (eeoc[field]) {
        this.eeocControls.push(...this[field]);
      }
    }

    this.consentControl = new CheckboxControl({
      key: 'consent',
      required: SettingsService.settings.privacyConsent.consentCheckbox,
      hidden: false,
      interactions: [
        {
          event: 'change',
          script: (FAPI: FieldInteractionApi) => {
            if (!FAPI.getValue('consent')) {
              FAPI.markAsInvalid('consent');
            }
          },
        },
      ],
    });

    this.form = this.formUtils.toFormGroup([...this.formControls, ...this.eeocControls, this.consentControl]);
    this.loading = false;
  }

  public close(applied: boolean = false): void {
    if (applied) {
      this.analytics.trackEvent(`Success applying to job ${this.job.id}`);
    } else {
      this.analytics.trackEvent(`Close apply form without applying for job ${this.job.id}`);
    }
    this.modalRef.close(undefined);
  }

  public save(): void {
    if (this.form.valid) {
      this.applying = true;
      this.analytics.trackEvent(`Apply to Job: ${this.job.id}`);
      let requestParams: any = {
        firstName: encodeURIComponent(this.form.value.firstName),
        lastName: encodeURIComponent(this.form.value.lastName),
        email: encodeURIComponent(this.form.value.email),
        phone: encodeURIComponent(this.form.value.phone || ''),
        format: this.form.value.resume[0].name.substring(this.form.value.resume[0].name.lastIndexOf('.') + 1),
      };

      if (this.form.value.gender) {
        requestParams.gender = encodeURIComponent(this.form.value.gender);
      }
      if (this.form.value.ethnicity) {
        requestParams.ethnicity = encodeURIComponent(this.form.value.ethnicity);
      }
      if (this.form.value.veteran) {
        requestParams.veteran = encodeURIComponent(this.form.value.veteran);
      }
      if (this.form.value.disability) {
        requestParams.disability = encodeURIComponent(this.form.value.disability);
      }
      if (this.source) {
        requestParams.source = this.source;
      }

      let formData: FormData = new FormData();
      formData.append('resume', this.form.value.resume[0].file);
      this.applyService.apply(this.job.id, requestParams, formData).subscribe(this.applyOnSuccess.bind(this), this.applyOnFailure.bind(this) );
    }
  }

  public viewPrivacyPolicy(): void {
    const url: string = SettingsService.settings.privacyConsent.privacyPolicyUrl;
    if (url === '/privacy') {
      this.router.navigate([url]);
    } else {
      window.open(url);
    }  }

  private applyOnSuccess(res: any): void {
    let toastOptions: any = {
      theme: 'success',
      icon: 'check',
      title: this.translate.instant('THANK_YOU'),
      message: this.translate.instant('YOU_WILL_BE_CONTACTED'),
      position: 'growlTopRight',
      hideDelay: 3000,
    };
    this.toaster.alert(toastOptions);
    let alreadyAppliedJobs: any = sessionStorage.getItem(this.APPLIED_JOBS_KEY);
    if (alreadyAppliedJobs) {
      let alreadyAppliedJobsArray: any = JSON.parse(alreadyAppliedJobs);
      alreadyAppliedJobsArray.push(this.job.id);
      sessionStorage.setItem(this.APPLIED_JOBS_KEY, JSON.stringify(alreadyAppliedJobsArray));
    } else {
      sessionStorage.setItem(this.APPLIED_JOBS_KEY, JSON.stringify([this.job.id]));
    }
    this.applying = false;
    this.close(true);
  }

  private applyOnFailure(res: any): void {
    this.hasError = true;
    this.applying = false;
  }
}
