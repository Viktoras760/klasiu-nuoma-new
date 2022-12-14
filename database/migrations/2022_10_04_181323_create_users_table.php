<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {

		$table->string('Name');
		$table->string('Surname');
		$table->biginteger('Personal_code');
		$table->string('email')->nullable()->default('NULL');
        $table->enum('Grade',[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
		$table->string('password');
        $table->biginteger('iat')->nullable()->default(0);
		$table->enum('Confirmation', ['Confirmed', 'Unconfirmed', 'Declined'])->default('Unconfirmed');
		$table->integer('id_User',true);
		$table->integer('fk_Schoolid_School')->nullable();
		$table->enum('Role',['Pupil','Teacher','School Administrator','System Administrator'])->default('Pupil');
        $table->rememberToken();
        $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user');
    }
};
