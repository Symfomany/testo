

### CLI

"""

python vigogne/train/train_sft.py \
    --model_name_or_path "bofenghuang/vigogne-13b-instruct" \
    --train_file "data/instruct/datas.jsonl" \
    --output_dir "outputs/llama-7b-ft-instruct-llmint8" \
    --run_name "llama-7b-ft-instruct-llmint8" \
    --overwrite_output_dir \
    --mode "instruct" \
    --model_max_length "512" \
    --preprocessing_num_workers "4" \
    --dataloader_num_workers "1" \
    --load_in_8bit \
    --lora_r "8" \
    --lora_alpha "16" \
    --lora_dropout "0.05" \
    --target_modules "q_proj" "v_proj" "k_proj" "o_proj" "gate_proj" "down_proj" "up_proj" \
    --per_device_train_batch_size "16" \
    --per_device_eval_batch_size "8" \
    --gradient_accumulation_steps "8" \
    --num_train_epochs "1" \
    --learning_rate "3e-4" \
    --warmup_ratio "0.05" \
    --weight_decay "0.01" \
    --gradient_checkpointing \
    --logging_steps "10" \
    --logging_first_step true \
    --save_strategy "steps" \
    --save_steps "10" \
    --save_total_limit "2" \
    --evaluation_strategy "steps" \
    --eval_steps "10" \
    --load_best_model_at_end \
    --report_to "tensorboard" "wandb" \
    --do_train \
    --do_eval