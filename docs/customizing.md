The career portal is an application that you are able to self host that was built with Typescript and Angular.  With the modularity of Angular, the repository is structured in a way that logically breaks up each section into individual components such as the sidebar or the apply modal.  Due to this structure, the Career Portal is very simple to customize.

## Colors/Look and Feel
The app was designed to have an easy entry points for common configuration. For example, we have included a `custom.css` file in the `/static` directory.  You are able to add your custom css to override the styles on your webpage. You are able to customize the css without rebuilding the application.

## Adding additional Information to your jobs.

You are able to add information on your webpage through [info chips found on the job details page and the job list](/job-details.md). This is simple configuration that doesn't require additional code.   If you would like to add additional functionality, we suggest reviewing [Angular's Template Syntax](https://angular.io/guide/template-syntax)


## Adding additional functionality to job site

The career portal was built with Angular and [Bullhorn's Novo-Elements component library](https://bullhorn.github.io/novo-elements).  This component library comes with many utilities and features that can easily be added to add different [toast](http://bullhorn.github.io/novo-elements/#/utils/toaster) or [modals](http://bullhorn.github.io/novo-elements/#/utils/modal), or even [field interactions](http://bullhorn.github.io/novo-elements/#/utils/field-interactions) to guide your candidate through filling out the job application.

## Building

Once you are done customizing the portal you will want to build it using the build steps found [here](https://github.com/bullhorn/career-portal#building)
