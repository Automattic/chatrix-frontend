/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { TemplateView } from "hydrogen-view-sdk";
import { LoginViewModel } from "../../viewmodels/LoginViewModel";
import {PasswordLoginView} from "./PasswordLoginView";
import {SingleSignOnView} from "./SingleSignOnView";

export class LoginView extends TemplateView<LoginViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: LoginViewModel) {
        return t.div({ className: "LoginView" }, [
            t.div({ className: "LoginView_welcome"}, [
                t.h4({}, vm.welcomeMessageHeading),
                t.p({}, vm.welcomeMessageText),
            ]),
            t.if(vm => vm.errorMessage, (t, vm) => t.p({className: "error"}, vm.i18n(vm.errorMessage))),
            t.mapView(vm => vm.singleSignOnViewModel, vm => vm ? new SingleSignOnView(vm): null),
            t.if(
                vm => vm.passwordLoginViewModel && vm.singleSignOnViewModel,
                t => t.p({className: "LoginView_separator"}, vm.i18n`or`)
            ),
            t.mapView(vm => vm.passwordLoginViewModel, vm => vm ? new PasswordLoginView(vm): null),
        ]);
    }
}
