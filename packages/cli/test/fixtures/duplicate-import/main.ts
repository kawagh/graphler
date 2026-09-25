// 同じモジュールを型の import と値の import の2行で読み込む
import type { Event } from "./handler";
import { handle } from "./handler";

export const run = (event: Event) => handle(event);
