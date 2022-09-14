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

import { AvatarView, MessageComposer, TemplateView, TimelineView, viewClassForTile } from "hydrogen-view-sdk";
import { ChatrixViewModel } from "../../viewmodels/ChatrixViewModel";
import { LoadingView } from "./LoadingView";

export class ChatrixView extends TemplateView<ChatrixViewModel> {
    constructor(value) {
        super(value);
    }

    render(t) {
        return t.div({className: "ChatrixView"}, [
            t.mapView(
                (vm) => (vm.roomViewModel ? vm : null),
                (vm) => (vm ? new RoomHeaderView(vm) : null)
            ),
            t.mapView(
                (vm) => vm.timelineViewModel,
                (vm) => (vm ? new TimelineView(vm, viewClassForTile) : new LoadingView())
            ),
            t.mapView(
                (vm) => vm.messageComposerViewModel,
                (vm) => (vm?.kind === "composer" ? new MessageComposer(vm) : null)
            ),
        ]);
    }
}

class RoomHeaderView extends TemplateView<ChatrixViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: ChatrixViewModel) {
        const avatar = vm.customAvatarURL ? t.img({
            className: "avatar",
            src: vm.customAvatarURL
        }) : t.view(new AvatarView(vm.roomViewModel, 30));
        return t.div({className: "RoomHeaderView"}, [
            avatar,
            t.div({className: "RoomHeaderView_name"}, vm => vm.roomName),
            t.div({className: "RoomHeaderView_menu"}, [
                t.button({
                    className: "RoomHeaderView_menu_settings", onClick: () => {
                        vm.showSettings();
                    }
                }),
                t.button({
                    className: "RoomHeaderView_menu_minimize", onClick: () => {
                        vm.minimize();
                    }
                }),
            ]),
        ]);
    }
}