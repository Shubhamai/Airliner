#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use log::LevelFilter;
// use window_shadows::set_shadow;
use rdev::{listen, EventType, Key};
use tauri::{AppHandle, Manager, WindowEvent};

#[derive(Clone, serde::Serialize)]
struct KeyPressed {
    message: String,
    key: String,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn handle_key_event(app_handle: &AppHandle, key: &Key, event: &str) {
    // if *key == Key::BackQuote {
    app_handle
        .emit_all(
            "key-pressed",
            KeyPressed {
                message: event.into(),
                key: format!("{:?}", key),
            },
        )
        .unwrap();
    // info!("Key: {:?}", key);
    // } else {
    //     // println!("Key: {:?}", key);
    // }
}

const SCHEME: &str = "airliner";
const BUNDLE_IDENTIFIER: &str = "com.airliner.dev";


fn main() -> Result<(), anyhow::Error> {

    tauri_plugin_deep_link::prepare(BUNDLE_IDENTIFIER);


    tauri::Builder::default()
        .setup(|app| {
            // let window = app.get_window("main").unwrap();
            // set_shadow(&window, true).expect("Unsupported platform!");

            app.set_device_event_filter(tauri::DeviceEventFilter::Always);

            let app_handle = app.app_handle();
            let handle = app.handle();

            tauri_plugin_deep_link::register(
                SCHEME,
                move |request| {
                //   dbg!(&request);
                  handle.emit_all("scheme-request-received", request).unwrap();
                },
              )
              .unwrap(/* If listening to the scheme is optional for your app, you don't want to unwrap here. */);
        

            tauri::async_runtime::spawn(async move {
                let mut current_key = Option::<Key>::None;

                listen(move |event| {
                    match event.event_type {
                        EventType::KeyPress(key) => {
                            if Some(key) != current_key {
                                current_key = Some(key);
                                handle_key_event(&app_handle, &key, "Pressed")
                            }
                        }
                        EventType::KeyRelease(key) => {
                            if Some(key) == current_key {
                                current_key = None;
                                handle_key_event(&app_handle, &key, "Released")
                            }
                        }
                        _ => (),
                    };
                })
                .unwrap();
            });

            Ok(())
        }) // Enable window shadows and rounded corners
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);

            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .plugin(
            tauri_plugin_log::Builder::default()
                // .targets([LogTarget::Stdout, LogTarget::Webview])
                .level_for("tauri", LevelFilter::Info)
                .level_for("hyper", LevelFilter::Info)
                .level(LevelFilter::Debug)
                .build(),
        )
        .on_window_event(|e| {
            if let WindowEvent::Resized(_) = e.event() {
                std::thread::sleep(std::time::Duration::from_millis(1));
            }
        }) // Helps reduce black background on resize
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
