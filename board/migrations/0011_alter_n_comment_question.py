# Generated by Django 4.0.1 on 2022-05-27 18:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0010_n_comment_remove_board_writer_remove_comment_answer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='n_comment',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='board.notice'),
        ),
    ]